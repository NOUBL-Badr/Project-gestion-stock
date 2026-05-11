package com.stock.gestion_stock.service;

import com.stock.gestion_stock.dto.FournisseurDTO;
import com.stock.gestion_stock.exception.ResourceNotFoundException;
import com.stock.gestion_stock.model.Fournisseur;
import com.stock.gestion_stock.repository.FournisseurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurService(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }

    public List<FournisseurDTO> getAllFournisseurs() {
        return fournisseurRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FournisseurDTO getFournisseurById(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fournisseur non trouvé avec l'id: " + id));
        return toDTO(fournisseur);
    }

    public FournisseurDTO createFournisseur(FournisseurDTO dto) {
        Fournisseur fournisseur = new Fournisseur();
        fournisseur.setNom(dto.getNom());
        fournisseur.setEmail(dto.getEmail());
        fournisseur.setTelephone(dto.getTelephone());
        fournisseur.setAdresse(dto.getAdresse());

        Fournisseur saved = fournisseurRepository.save(fournisseur);
        return toDTO(saved);
    }

    public FournisseurDTO updateFournisseur(Long id, FournisseurDTO dto) {
        Fournisseur fournisseur = fournisseurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fournisseur non trouvé avec l'id: " + id));

        fournisseur.setNom(dto.getNom());
        fournisseur.setEmail(dto.getEmail());
        fournisseur.setTelephone(dto.getTelephone());
        fournisseur.setAdresse(dto.getAdresse());

        Fournisseur updated = fournisseurRepository.save(fournisseur);
        return toDTO(updated);
    }

    public void deleteFournisseur(Long id) {
        if (!fournisseurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fournisseur non trouvé avec l'id: " + id);
        }
        fournisseurRepository.deleteById(id);
    }

    public List<FournisseurDTO> searchFournisseurs(String nom) {
        return fournisseurRepository.findByNomContainingIgnoreCase(nom).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private FournisseurDTO toDTO(Fournisseur fournisseur) {
        return FournisseurDTO.builder()
                .id(fournisseur.getId())
                .nom(fournisseur.getNom())
                .email(fournisseur.getEmail())
                .telephone(fournisseur.getTelephone())
                .adresse(fournisseur.getAdresse())
                .nombreProduits(fournisseur.getProduits() != null ? fournisseur.getProduits().size() : 0)
                .build();
    }
}
