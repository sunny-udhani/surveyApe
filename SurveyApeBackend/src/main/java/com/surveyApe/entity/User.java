package com.surveyApe.entity;

import javax.persistence.*;

@Entity
public class User {
    @Id
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private String userType;
    private String verificationInd;
    private String uniqueVerificationCode;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getVerificationInd() {
        return verificationInd;
    }

    public void setVerificationInd(String verificationInd) {
        this.verificationInd = verificationInd;
    }

    public String getUniqueVerificationCode() {
        return uniqueVerificationCode;
    }

    public void setUniqueVerificationCode(String uniqueVerificationCode) {
        this.uniqueVerificationCode = uniqueVerificationCode;
    }

    //    @Column(unique = true)
    private String phone; // Phone numbers must be unique

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

}
