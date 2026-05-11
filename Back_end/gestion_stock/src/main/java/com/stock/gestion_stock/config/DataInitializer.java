package com.stock.gestion_stock.config;

import com.stock.gestion_stock.model.Fournisseur;
import com.stock.gestion_stock.model.Produit;
import com.stock.gestion_stock.model.Role;
import com.stock.gestion_stock.model.Utilisateur;
import com.stock.gestion_stock.repository.FournisseurRepository;
import com.stock.gestion_stock.repository.ProduitRepository;
import com.stock.gestion_stock.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final FournisseurRepository fournisseurRepository;
    private final ProduitRepository produitRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           FournisseurRepository fournisseurRepository,
                           ProduitRepository produitRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.fournisseurRepository = fournisseurRepository;
        this.produitRepository = produitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Créer un admin par défaut s'il n'existe pas
        if (!utilisateurRepository.existsByUsername("admin")) {
            Utilisateur admin = Utilisateur.builder()
                    .nom("Administrateur")
                    .prenom("System")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            utilisateurRepository.save(admin);
            System.out.println(" Compte ADMIN créé : admin / admin123");
        }

        // Créer un employé par défaut s'il n'existe pas
        if (!utilisateurRepository.existsByUsername("employe")) {
            Utilisateur employe = Utilisateur.builder()
                    .nom("Zidane")
                    .prenom("Omar")
                    .username("employe")
                    .password(passwordEncoder.encode("employe123"))
                    .role(Role.EMPLOYE)
                    .actif(true)
                    .build();
            utilisateurRepository.save(employe);
            System.out.println(" Compte EMPLOYE créé : employe / employe123");
        }

        // Créer des données de démonstration si la base est vide
        if (fournisseurRepository.count() == 0) {
            Fournisseur f1 = fournisseurRepository.save(Fournisseur.builder()
                    .nom("TechnoPlus")
                    .email("contact@technoplus.com")
                    .telephone("0612345678")
                    .adresse("123 Rue de la Tech, Casablanca")
                    .build());

            Fournisseur f2 = fournisseurRepository.save(Fournisseur.builder()
                    .nom("ElectroMaroc")
                    .email("info@electromaroc.ma")
                    .telephone("0698765432")
                    .adresse("456 Boulevard Hassan II, Rabat")
                    .build());

            Fournisseur f3 = fournisseurRepository.save(Fournisseur.builder()
                    .nom("FourniPro")
                    .email("commande@fournipro.com")
                    .telephone("0654321098")
                    .adresse("789 Avenue Mohammed V, Fès")
                    .build());

            System.out.println(" 3 fournisseurs de démonstration créés");

            if (produitRepository.count() == 0) {
                produitRepository.save(Produit.builder()
                        .nom("Ordinateur Portable HP")
                        .description("HP ProBook 450 G10, 16GB RAM, 512GB SSD")
                        .prix(8500.00)
                        .quantite(25)
                        .seuilAlerte(5)
                        .fournisseur(f1)
                        .build());

                produitRepository.save(Produit.builder()
                        .nom("Souris sans fil Logitech")
                        .description("Logitech M185 Wireless")
                        .prix(120.00)
                        .quantite(3)
                        .seuilAlerte(10)
                        .fournisseur(f1)
                        .build());

                produitRepository.save(Produit.builder()
                        .nom("Câble HDMI 2m")
                        .description("Câble HDMI 2.1, 4K, 2 mètres")
                        .prix(45.00)
                        .quantite(100)
                        .seuilAlerte(15)
                        .fournisseur(f2)
                        .build());

                produitRepository.save(Produit.builder()
                        .nom("Clavier mécanique")
                        .description("Clavier Cherry MX Blue, rétroéclairé")
                        .prix(350.00)
                        .quantite(2)
                        .seuilAlerte(5)
                        .fournisseur(f2)
                        .build());

                produitRepository.save(Produit.builder()
                        .nom("Écran 27 pouces")
                        .description("Samsung 27\" 4K UHD, IPS")
                        .prix(3200.00)
                        .quantite(8)
                        .seuilAlerte(3)
                        .fournisseur(f3)
                        .build());

                System.out.println(" 5 produits de démonstration créés");
            }
        }
    }
}
