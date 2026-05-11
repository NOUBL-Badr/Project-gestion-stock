package com.stock.gestion_stock.service;

import com.stock.gestion_stock.dto.MouvementStockDTO;
import com.stock.gestion_stock.exception.ResourceNotFoundException;
import com.stock.gestion_stock.model.*;
import com.stock.gestion_stock.repository.MouvementStockRepository;
import com.stock.gestion_stock.repository.ProduitRepository;
import com.stock.gestion_stock.repository.UtilisateurRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MouvementStockService {

    private final MouvementStockRepository mouvementStockRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;

    public MouvementStockService(MouvementStockRepository mouvementStockRepository,
                                  ProduitRepository produitRepository,
                                  UtilisateurRepository utilisateurRepository) {
        this.mouvementStockRepository = mouvementStockRepository;
        this.produitRepository = produitRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<MouvementStockDTO> getAllMouvements() {
        return mouvementStockRepository.findAllByOrderByDateMouvementDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MouvementStockDTO> getMouvementsByProduit(Long produitId) {
        return mouvementStockRepository.findByProduitId(produitId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MouvementStockDTO> getMouvementsRecents() {
        return mouvementStockRepository.findTop10ByOrderByDateMouvementDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MouvementStockDTO enregistrerMouvement(MouvementStockDTO dto) {
        // Trouver le produit
        Produit produit = produitRepository.findById(dto.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Produit non trouvé avec l'id: " + dto.getProduitId()));

        TypeMouvement type = TypeMouvement.valueOf(dto.getTypeMouvement());

        // Vérifier qu'on ne retire pas plus que le stock disponible
        if (type == TypeMouvement.SORTIE && produit.getQuantite() < dto.getQuantite()) {
            throw new IllegalArgumentException(
                    "Stock insuffisant. Stock actuel: " + produit.getQuantite()
                    + ", quantité demandée: " + dto.getQuantite());
        }

        // Mettre à jour la quantité du produit
        if (type == TypeMouvement.ENTREE) {
            produit.setQuantite(produit.getQuantite() + dto.getQuantite());
        } else {
            produit.setQuantite(produit.getQuantite() - dto.getQuantite());
        }
        produitRepository.save(produit);

        // Trouver l'utilisateur connecté
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username).orElse(null);

        // Créer le mouvement
        MouvementStock mouvement = new MouvementStock();
        mouvement.setTypeMouvement(type);
        mouvement.setQuantite(dto.getQuantite());
        mouvement.setRemarque(dto.getRemarque());
        mouvement.setProduit(produit);
        mouvement.setUtilisateur(utilisateur);

        MouvementStock saved = mouvementStockRepository.save(mouvement);
        return toDTO(saved);
    }

    private MouvementStockDTO toDTO(MouvementStock mouvement) {
        return MouvementStockDTO.builder()
                .id(mouvement.getId())
                .typeMouvement(mouvement.getTypeMouvement().name())
                .quantite(mouvement.getQuantite())
                .dateMouvement(mouvement.getDateMouvement())
                .remarque(mouvement.getRemarque())
                .produitId(mouvement.getProduit().getId())
                .produitNom(mouvement.getProduit().getNom())
                .utilisateurNom(mouvement.getUtilisateur() != null
                        ? mouvement.getUtilisateur().getNom() + " " + mouvement.getUtilisateur().getPrenom()
                        : null)
                .build();
    }
}
