package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.ProduitDTO;
import com.stock.gestion_stock.service.ProduitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    
    // GET /api/produits — Liste tous les produits
    
    @GetMapping
    public ResponseEntity<List<ProduitDTO>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    
    // GET /api/produits/{id} — Récupère un produit par son ID
    
    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getProduitById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.getProduitById(id));
    }

    
    // POST /api/produits — Crée un nouveau produit (ADMIN uniquement)
    
    @PostMapping
    public ResponseEntity<ProduitDTO> createProduit(@RequestBody ProduitDTO produitDTO) {
        return ResponseEntity.ok(produitService.createProduit(produitDTO));
    }

    
    // PUT /api/produits/{id} — Modifie un produit (ADMIN uniquement)
    
    @PutMapping("/{id}")
    public ResponseEntity<ProduitDTO> updateProduit(@PathVariable Long id, @RequestBody ProduitDTO produitDTO) {
        return ResponseEntity.ok(produitService.updateProduit(id, produitDTO));
    }

        
    // DELETE /api/produits/{id} — Supprime un produit (ADMIN uniquement)
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }

    
    // GET /api/produits/search?nom=xxx&fournisseurId=1 — Recherche et filtrage
    
    @GetMapping("/search")
    public ResponseEntity<List<ProduitDTO>> searchProduits(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) Long fournisseurId) {
        return ResponseEntity.ok(produitService.searchProduits(nom, fournisseurId));
    }

        
    // GET /api/produits/alertes — Produits en stock faible
        
    @GetMapping("/alertes")
    public ResponseEntity<List<ProduitDTO>> getProduitsEnAlerte() {
        return ResponseEntity.ok(produitService.getProduitsEnAlerte());
    }
}
