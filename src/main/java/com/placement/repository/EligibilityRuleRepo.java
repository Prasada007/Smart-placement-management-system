package com.placement.repository;
import com.placement.model.EligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EligibilityRuleRepo extends JpaRepository<EligibilityRule, Integer> {
    Optional<EligibilityRule> findByCompanyId(Integer companyId);
}