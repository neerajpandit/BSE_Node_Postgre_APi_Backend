import pool from '../config/db.js';

export async function createTables() {

    const uccRegisterQuery =`
        CREATE TABLE IF NOT EXISTS uccRegister(
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        admin_userid VARCHAR(255),
        adminmembercode VARCHAR(255),
        admin_password VARCHAR(255),
        regntype VARCHAR(255) CHECK (regntype IN ('NEW' , 'MOD')),
        param TEXT,
        response_status VARCHAR(255),
        response_remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
    );

    `;

    const userProfilesQuery = `
        CREATE TABLE IF NOT EXISTS UserProfiles (
            id SERIAL PRIMARY KEY,
            phone_no VARCHAR(10) UNIQUE NOT NULL,
            phone_otp VARCHAR(6),  -- OTP for phone verification
            verify_phone BOOLEAN DEFAULT FALSE,  -- Phone verification status
            email VARCHAR(50) UNIQUE,
            email_otp VARCHAR(6),  -- OTP for email verification  
            verify_email BOOLEAN DEFAULT FALSE,  -- Email verification status  
            password TEXT,
            img_url VARCHAR(255),  -- Store the image URL
            kycStatus VARCHAR(20) DEFAULT 'Pending',  -- KYC status
            referral_id VARCHAR(50),  -- Sub-broker's referral ID
            user_status VARCHAR(20) DEFAULT 'Active',  -- Track user status
            access_token TEXT,  -- JWT Token
            refresh_token TEXT,  -- Refresh Token
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `;

    const uccProfileQuery=`
        CREATE TABLE IF NOT EXISTS uccProfiles(
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            client_id VARCHAR(10) UNIQUE,--UCC Code
            phone_declaration_flag VARCHAR(2) DEFAULT 'SE',
            email_declaration_flag VARCHAR(2) DEFAULT 'SE',
            primary_holder_first_name VARCHAR(70),
            primary_holder_middle_name VARCHAR(70),
            primary_holder_last_name VARCHAR(70),
            tax_status VARCHAR(50) ,
            gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
            primary_holder_dob TEXT ,
            occupation VARCHAR(50),
            holding_nature VARCHAR(50) CHECK(holding_nature IN ('SI','JO','AS')), 
            client_type CHAR(1) DEFAULT 'P' CHECK (client_type IN ('P', 'D')),
            marital_status VARCHAR(20),
            communication_mode VARCHAR(1) DEFAULT 'E' NOT NULL,
            nomination_opt VARCHAR(1) DEFAULT 'Y' CHECK (nomination_opt IN ('Y', 'N')),
            nomination_auth_mode VARCHAR(1) DEFAULT 'O' CHECK(nomination_auth_mode IN ('E','O','W')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
        );
    
    `;

    const addressQuery =`
        CREATE TABLE IF NOT EXISTS Addresses (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,  -- Foreign Key to UserProfiles
            address_type VARCHAR(20),  -- Permanent, Correspondence, etc.
            address_1 VARCHAR(40),
            address_2 VARCHAR(40),
            address_3 VARCHAR(40),
            city VARCHAR(35),
            state VARCHAR(2),
            pincode CHAR(6),
            country VARCHAR(35),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
        );
    `;

    const bankDetailsQuery = `
        CREATE TABLE IF NOT EXISTS BankDetails (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            account_type VARCHAR(2) NOT NULL,
            account_no VARCHAR(40) NOT NULL,
            bank_name VARCHAR(100),
            account_holder_name VARCHAR(100),
            ifsc_code VARCHAR(11) NOT NULL,
            micr_code VARCHAR(9),
            branch_name VARCHAR(100),
            default_bank_flag CHAR(1) NOT NULL CHECK (default_bank_flag IN ('Y', 'N')),
            transaction_mode VARCHAR(20),  -- P (Physical), E (Electronic),
            divind_pay_mode VARCHAR(2) DEFAULT '02',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
        );
    `;

    const nomineeQuery =`
        CREATE TABLE IF NOT EXISTS NomineeDetails (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            nominee_name VARCHAR(40),
            nominee_relationship VARCHAR(40), 
            nominee_applicable_percent NUMERIC(5, 2),
            minor_flag CHAR(1) CHECK (minor_flag IN ('Y', 'N')),
            nominee_dob DATE,
            nominee_guardian_name VARCHAR(35),
            guardian_relationship VARCHAR(50),
            nominee_kyc_status VARCHAR(20) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
        );
    `;

    const kycDetailsQuery =`
        CREATE TABLE IF NOT EXISTS KYCDetails (
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,  -- Foreign Key to UserProfiles
            pan_exempt CHAR(1) DEFAULT 'N' CHECK(pan_exempt IN ('Y', 'N')),
            pan_number CHAR(10) CHECK (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
            kyc_status VARCHAR(20) DEFAULT 'Pending',
            kyc_type CHAR(1) DEFAULT 'K' CHECK(kyc_type IN('K','C','B','E' )),
            aadhaar_updated CHAR(1) DEFAULT 'N' CHECK (aadhaar_updated IN ('Y', 'N')),
            paperless_flag CHAR(1) DEFAULT 'Z' CHECK (paperless_flag IN ('P', 'Z')),
            kyc_verified_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES UserProfiles(id) ON DELETE CASCADE
        );
    `;

    try {
        await pool.query(userProfilesQuery); // Create userprofiles first
        await pool.query(uccProfileQuery);
        await pool.query(addressQuery);//create addressQuery
        await pool.query(bankDetailsQuery); // Then create BankDetails
        await pool.query(kycDetailsQuery); //Create Kyc Details
        await pool.query(nomineeQuery); //Then create Nominee

        await pool.query(uccRegisterQuery);//BSE Final Register
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error.stack);
    }
}


