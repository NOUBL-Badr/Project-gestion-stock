package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.MouvementStockDTO;
import com.stock.gestion_stock.service.MouvementStockService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mouvements")
@CrossOrigin(origins = "*")
public class MouvementStockController {

    private final MouvementStockService mouvementStockService;

    public MouvementStockController(MouvementStockService mouvementStockService) {
        this.mouvementStockService = mouvementStockService;
    }

    
    // GET /api/mouvements — Liste tous les mouvements
    
    @GetMapping
    public ResponseEntity<List<MouvementStockDTO>> getAllMouvements() {
        return ResponseEntity.ok(mouvementStockService.getAllMouvements());
    }

    
     // GET /api/mouvements/recents — Derniers 10 mouvements
    
    @GetMapping("/recents")
    public ResponseEntity<List<MouvementStockDTO>> getMouvementsRecents() {
        return ResponseEntity.ok(mouvementStockService.getMouvementsRecents());
    }

    
     // GET /api/mouvements/produit/{produitId} — Mouvements d'un produit
    
    @GetMapping("/produit/{produitId}")
    public ResponseEntity<List<MouvementStockDTO>> getMouvementsByProduit(@PathVariable Long produitId) {
        return ResponseEntity.ok(mouvementStockService.getMouvementsByProduit(produitId));
    }

    
     // POST /api/mouvements — Enregistrer une entrée ou sortie
    
    @PostMapping
    public ResponseEntity<MouvementStockDTO> enregistrerMouvement(
            @Valid @RequestBody MouvementStockDTO mouvementDTO) {
        return ResponseEntity.ok(mouvementStockService.enregistrerMouvement(mouvementDTO));
    }
}
