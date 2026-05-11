package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.FournisseurDTO;
import com.stock.gestion_stock.service.FournisseurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@CrossOrigin(origins = "*")
public class FournisseurController {

    private final FournisseurService fournisseurService;

    public FournisseurController(FournisseurService fournisseurService) {
        this.fournisseurService = fournisseurService;
    }

    
    //GET /api/fournisseurs — Liste tous les fournisseurs
   
    @GetMapping
    public ResponseEntity<List<FournisseurDTO>> getAllFournisseurs() {
        return ResponseEntity.ok(fournisseurService.getAllFournisseurs());
    }

    
    //GET /api/fournisseurs/{id} — Récupère un fournisseur par son ID
 
    @GetMapping("/{id}")
    public ResponseEntity<FournisseurDTO> getFournisseurById(@PathVariable Long id) {
        return ResponseEntity.ok(fournisseurService.getFournisseurById(id));
    }

        
    //POST /api/fournisseurs — Crée un nouveau fournisseur (ADMIN uniquement)
   
    @PostMapping
    public ResponseEntity<FournisseurDTO> createFournisseur(@RequestBody FournisseurDTO fournisseurDTO) {
        return ResponseEntity.ok(fournisseurService.createFournisseur(fournisseurDTO));
    }

        
     // PUT /api/fournisseurs/{id} — Modifie un fournisseur (ADMIN uniquement)
        
    @PutMapping("/{id}")
    public ResponseEntity<FournisseurDTO> updateFournisseur(@PathVariable Long id,
                                                            @RequestBody FournisseurDTO fournisseurDTO) {
        return ResponseEntity.ok(fournisseurService.updateFournisseur(id, fournisseurDTO));
    }

    
    // DELETE /api/fournisseurs/{id} — Supprime un fournisseur (ADMIN uniquement)
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Long id) {
        fournisseurService.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }

    
   // GET /api/fournisseurs/search?nom=xxx — Recherche par nom
    
    @GetMapping("/search")
    public ResponseEntity<List<FournisseurDTO>> searchFournisseurs(@RequestParam String nom) {
        return ResponseEntity.ok(fournisseurService.searchFournisseurs(nom));
    }
}
