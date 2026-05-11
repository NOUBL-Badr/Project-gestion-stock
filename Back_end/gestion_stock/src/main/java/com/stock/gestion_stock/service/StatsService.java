package com.stock.gestion_stock.service;

import com.stock.gestion_stock.dto.MouvementStockDTO;
import com.stock.gestion_stock.dto.ProduitDTO;
import com.stock.gestion_stock.dto.StatsDTO;
import com.stock.gestion_stock.model.Produit;
import com.stock.gestion_stock.repository.FournisseurRepository;
import com.stock.gestion_stock.repository.MouvementStockRepository;
import com.stock.gestion_stock.repository.ProduitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatsService {

    private final ProduitRepository produitRepository;
    private final FournisseurRepository fournisseurRepository;
    private final MouvementStockRepository mouvementStockRepository;

    public StatsService(ProduitRepository produitRepository,
                        FournisseurRepository fournisseurRepository,
                        MouvementStockRepository mouvementStockRepository) {
        this.produitRepository = produitRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.mouvementStockRepository = mouvementStockRepository;
    }

    public StatsDTO getStats() {
        List<Produit> allProduits = produitRepository.findAll();

        // Produits en alerte de stock faible
        List<ProduitDTO> produitsEnAlerte = allProduits.stream()
                .filter(Produit::isStockFaible)
                .map(p -> ProduitDTO.builder()
                        .id(p.getId())
                        .nom(p.getNom())
                        .description(p.getDescription())
                        .prix(p.getPrix())
                        .quantite(p.getQuantite())
                        .seuilAlerte(p.getSeuilAlerte())
                        .fournisseurId(p.getFournisseur() != null ? p.getFournisseur().getId() : null)
                        .fournisseurNom(p.getFournisseur() != null ? p.getFournisseur().getNom() : null)
                        .stockFaible(true)
                        .build())
                .collect(Collectors.toList());

        // Mouvements récents
        List<MouvementStockDTO> mouvementsRecents = mouvementStockRepository
                .findTop10ByOrderByDateMouvementDesc().stream()
                .map(m -> MouvementStockDTO.builder()
                        .id(m.getId())
                        .typeMouvement(m.getTypeMouvement().name())
                        .quantite(m.getQuantite())
                        .dateMouvement(m.getDateMouvement())
                        .remarque(m.getRemarque())
                        .produitId(m.getProduit().getId())
                        .produitNom(m.getProduit().getNom())
                        .utilisateurNom(m.getUtilisateur() != null
                                ? m.getUtilisateur().getNom() + " " + m.getUtilisateur().getPrenom()
                                : null)
                        .build())
                .collect(Collectors.toList());

        // Valeur totale du stock
        double valeurTotale = allProduits.stream()
                .mapToDouble(p -> p.getPrix() * p.getQuantite())
                .sum();

        return StatsDTO.builder()
                .totalProduits(allProduits.size())
                .totalFournisseurs(fournisseurRepository.count())
                .produitsStockFaible(produitsEnAlerte.size())
                .totalMouvements(mouvementStockRepository.count())
                .valeurTotaleStock(valeurTotale)
                .produitsEnAlerte(produitsEnAlerte)
                .mouvementsRecents(mouvementsRecents)
                .build();
    }
}
