package org.example.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double monthlyIncome;
    private Double savingsTarget;
    private String investmentPreferences;
    private String riskTolerance;
    private String financialGoals;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonBackReference
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Double getSavingsTarget() {
        return savingsTarget;
    }

    public void setSavingsTarget(Double savingsTarget) {
        this.savingsTarget = savingsTarget;
    }

    public String getInvestmentPreferences() {
        return investmentPreferences;
    }

    public void setInvestmentPreferences(String investmentPreferences) {
        this.investmentPreferences = investmentPreferences;
    }

    public String getRiskTolerance() {
        return riskTolerance;
    }

    public void setRiskTolerance(String riskTolerance) {
        this.riskTolerance = riskTolerance;
    }

    public String getFinancialGoals() {
        return financialGoals;
    }

    public void setFinancialGoals(String financialGoals) {
        this.financialGoals = financialGoals;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
