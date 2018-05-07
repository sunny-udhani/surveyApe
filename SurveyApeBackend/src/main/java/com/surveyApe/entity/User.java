package com.surveyApe.entity;

import javax.persistence.*;

@Entity
public class User {
    @Id
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private int userType;
    private boolean verificationInd;
    private String uniqueVerificationCode;

    // we will see about bidirectionality
    // private List<Survey> survey;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

//    public boolean getVerificationInd() {
//        return verificationInd;
//    }

    public void setVerificationInd(boolean verificationInd) {
        this.verificationInd = verificationInd;
    }

    public String getUniqueVerificationCode() {
        return uniqueVerificationCode;
    }

    public boolean isVerificationInd() {
        return verificationInd;
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
