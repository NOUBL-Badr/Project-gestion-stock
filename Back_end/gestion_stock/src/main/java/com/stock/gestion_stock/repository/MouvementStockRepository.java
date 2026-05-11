package com.stock.gestion_stock.repository;

import com.stock.gestion_stock.model.MouvementStock;
import com.stock.gestion_stock.model.TypeMouvement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {

    List<MouvementStock> findByProduitId(Long produitId);

    List<MouvementStock> findByTypeMouvement(TypeMouvement typeMouvement);

    List<MouvementStock> findTop10ByOrderByDateMouvementDesc();

    List<MouvementStock> findAllByOrderByDateMouvementDesc();
}
