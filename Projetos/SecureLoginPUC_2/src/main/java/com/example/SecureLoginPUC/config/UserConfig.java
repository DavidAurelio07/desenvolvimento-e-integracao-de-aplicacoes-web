package com.example.SecureLoginPUC.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserConfig {

    @Value("${app.user.username}")
    private String userUsername;

    @Value("${app.user.name}")
    private String userName;

    @Value("${app.user.password}")
    private String userPassword;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;
    

    public String getUserUsername() {
        return userUsername;
    }

    public String getUserName(){
        return userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public String getAdminUsername() {
        return adminUsername;
    }

    public String getAdminName(){
        return adminName;
    }

    public String getAdminPassword() {
        return adminPassword;
    }
}
