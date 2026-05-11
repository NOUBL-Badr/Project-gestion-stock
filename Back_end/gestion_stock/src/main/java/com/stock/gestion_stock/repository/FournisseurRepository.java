package com.stock.gestion_stock.repository;

import com.stock.gestion_stock.model.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {

    List<Fournisseur> findByNomContainingIgnoreCase(String nom);
}
