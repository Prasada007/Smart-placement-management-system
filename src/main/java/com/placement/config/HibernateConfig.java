package com.placement.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.placement.repository")
public class HibernateConfig {

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");

        String url = System.getProperty("DB_URL");
        if (url == null) {
            url = System.getenv("DB_URL");
        }
        if (url == null) {
            url = "jdbc:mysql://localhost:3306/spms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        }
        String username = System.getProperty("DB_USERNAME");
        if (username == null) {
            username = System.getenv("DB_USERNAME");
        }
        if (username == null) {
            username = "root";
        }
        String password = System.getProperty("DB_PASSWORD");
        if (password == null) {
            password = System.getenv("DB_PASSWORD");
        }
        if (password == null) {
            password = "Prasad@07";
        }

        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em =
                new LocalContainerEntityManagerFactoryBean();

        em.setDataSource(dataSource());
        em.setPackagesToScan("com.placement.model");
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setJpaProperties(hibernateProperties());

        return em;
    }

    private Properties hibernateProperties() {
        Properties props = new Properties();
        props.setProperty("hibernate.dialect",
                "org.hibernate.dialect.MySQLDialect");
        props.setProperty("hibernate.show_sql", "true");
        props.setProperty("hibernate.format_sql", "true");

        props.setProperty("hibernate.hbm2ddl.auto", "update");
        return props;
    }

    @Bean
    public PlatformTransactionManager transactionManager(
            EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}