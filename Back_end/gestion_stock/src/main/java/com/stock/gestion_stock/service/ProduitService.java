package com.stock.gestion_stock.service;

import com.stock.gestion_stock.dto.ProduitDTO;
import com.stock.gestion_stock.exception.ResourceNotFoundException;
import com.stock.gestion_stock.model.Fournisseur;
import com.stock.gestion_stock.model.Produit;
import com.stock.gestion_stock.repository.FournisseurRepository;
import com.stock.gestion_stock.repository.ProduitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final FournisseurRepository fournisseurRepository;

    public ProduitService(ProduitRepository produitRepository, FournisseurRepository fournisseurRepository) {
        this.produitRepository = produitRepository;
        this.fournisseurRepository = fournisseurRepository;
    }

    public List<ProduitDTO> getAllProduits() {
        return produitRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProduitDTO getProduitById(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'id: " + id));
        return toDTO(produit);
    }

    public ProduitDTO createProduit(ProduitDTO dto) {
        Produit produit = new Produit();
        produit.setNom(dto.getNom());
        produit.setDescription(dto.getDescription());
        produit.setPrix(dto.getPrix());
        produit.setQuantite(dto.getQuantite());
        produit.setSeuilAlerte(dto.getSeuilAlerte());

        if (dto.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(dto.getFournisseurId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Fournisseur non trouvé avec l'id: " + dto.getFournisseurId()));
            produit.setFournisseur(fournisseur);
        }

        Produit saved = produitRepository.save(produit);
        return toDTO(saved);
    }

    public ProduitDTO updateProduit(Long id, ProduitDTO dto) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé avec l'id: " + id));

        produit.setNom(dto.getNom());
        produit.setDescription(dto.getDescription());
        produit.setPrix(dto.getPrix());
        produit.setQuantite(dto.getQuantite());
        produit.setSeuilAlerte(dto.getSeuilAlerte());

        if (dto.getFournisseurId() != null) {
            Fournisseur fournisseur = fournisseurRepository.findById(dto.getFournisseurId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Fournisseur non trouvé avec l'id: " + dto.getFournisseurId()));
            produit.setFournisseur(fournisseur);
        } else {
            produit.setFournisseur(null);
        }

        Produit updated = produitRepository.save(produit);
        return toDTO(updated);
    }

    public void deleteProduit(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produit non trouvé avec l'id: " + id);
        }
        produitRepository.deleteById(id);
    }

    public List<ProduitDTO> searchProduits(String nom, Long fournisseurId) {
        List<Produit> produits;
        if (nom != null && fournisseurId != null) {
            produits = produitRepository.findByNomContainingIgnoreCaseAndFournisseurId(nom, fournisseurId);
        } else if (nom != null) {
            produits = produitRepository.findByNomContainingIgnoreCase(nom);
        } else if (fournisseurId != null) {
            produits = produitRepository.findByFournisseurId(fournisseurId);
        } else {
            produits = produitRepository.findAll();
        }
        return produits.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ProduitDTO> getProduitsEnAlerte() {
        return produitRepository.findAll().stream()
                .filter(Produit::isStockFaible)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ProduitDTO toDTO(Produit produit) {
        return ProduitDTO.builder()
                .id(produit.getId())
                .nom(produit.getNom())
                .description(produit.getDescription())
                .prix(produit.getPrix())
                .quantite(produit.getQuantite())
                .seuilAlerte(produit.getSeuilAlerte())
                .fournisseurId(produit.getFournisseur() != null ? produit.getFournisseur().getId() : null)
                .fournisseurNom(produit.getFournisseur() != null ? produit.getFournisseur().getNom() : null)
                .stockFaible(produit.isStockFaible())
                .build();
    }
}
