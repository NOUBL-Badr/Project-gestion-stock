package com.stock.gestion_stock.controller;

import com.stock.gestion_stock.dto.RegisterRequest;
import com.stock.gestion_stock.dto.UtilisateurDTO;
import com.stock.gestion_stock.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    
    // GET /api/utilisateurs — Liste tous les utilisateurs (ADMIN uniquement)
    
    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.getAllUtilisateurs());
    }

    //GET /api/utilisateurs/{id} — Récupère un utilisateur (ADMIN uniquement)
     
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> getUtilisateurById(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.getUtilisateurById(id));
    }

        
    //POST /api/utilisateurs — Crée un utilisateur (ADMIN uniquement)
    
    @PostMapping
    public ResponseEntity<UtilisateurDTO> createUtilisateur(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(utilisateurService.createUtilisateur(request));
    }

    
    //PUT /api/utilisateurs/{id} — Modifie un utilisateur (ADMIN uniquement)
    
    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> updateUtilisateur(@PathVariable Long id,
                                                            @RequestBody UtilisateurDTO dto) {
        return ResponseEntity.ok(utilisateurService.updateUtilisateur(id, dto));
    }

        
     // DELETE /api/utilisateurs/{id} — Supprime un utilisateur (ADMIN uniquement)
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}
