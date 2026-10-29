export interface paths {
    "/api/rest/public/2fa/credentials/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * @description Delete specified WebAuthn credential
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        delete: operations["delete2FACredential"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/credentials/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List all registered WebAuthn credentials */
        get: operations["list2FACredentials"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/login/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Finish FIDO2 2FA login ceremony */
        post: operations["2FAFido2LoginCeremonyFinish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/login/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Begin FIDO2 2FA login ceremony */
        post: operations["2FAFido2LoginCeremonyStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/recovery-codes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Show current 2FA recovery codes
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        get: operations["show2FARecoveryCodes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/recovery-codes/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Regenerate 2FA recovery codes
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["regenerate2FARecoveryCodes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/totp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * @description Delete currently set up TOTP 2FA authenticator
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        delete: operations["deleteTOTP2FAAuthenticator"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/totp/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Authenticate login flow using a TOTP */
        post: operations["2FALoginViaTOTP"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/totp/registration/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Finish a TOTP 2FA authenticator registration
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["totp2FAAuthenticatorRegistrationFinish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/2fa/totp/registration/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Start a TOTP 2FA authenticator registration (show QR code)
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["totp2FAAuthenticatorRegistrationStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get application version details
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["getAppVersion"];
        /**
         * @description Update application version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["updateAppVersion"];
        post?: never;
        /**
         * @description Delete application version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["deleteAppVersion"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}/app-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get application code for specific app version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        get: operations["getAppVersionAppCode"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}/build-and-deploy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Build and deploy application version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["buildAndDeployAppVersion"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}/cancel-build": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Cancel application version build
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["cancelAppVersionBuild"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}/deploy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Deploy application version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["deployAppVersion"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/app-version/{id}/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @deprecated
         * @description Uploads build artefact for app-version with support for file streaming
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["uploadAppVersionArtefact"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Starts a device login of an app. The app opens verificationUrl in the browser and then checks the result. */
        post: operations["deviceLoginInitiate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns information about a device login for the consent page.
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        get: operations["deviceLoginInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login/{requestId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Approves a device login, the app then receives tokens of the current user.
         *     A SUDO request needs the current session in sudo mode and puts the initiating session into sudo mode.
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        put: operations["deviceLoginApprove"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login/{requestId}/deny": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Denies a device login.
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        put: operations["deviceLoginDeny"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Returns the state of a device login. Once approved, returns new tokens exactly once.
         *     A CONFIDENTIAL app confirms a denial here, never from the error parameter of its callback alone.
         */
        post: operations["deviceLoginCheck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/device-login/sudo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Starts a device login that puts the current session into sudo mode once its user approves it in the browser.
         *     The app checks the result like a login, but receives no tokens.
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["deviceLoginSudoInitiate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns user information based on the accessToken */
        get: operations["GetAuthUserInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Verify user email and password */
        post: operations["userLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Invalidate access and refresh tokens */
        post: operations["userLogout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Returns new access and refresh token */
        post: operations["refreshToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/auth/sudo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns information whether current user session is in Sudo mode or not. */
        get: operations["getUserSudoMode"];
        put?: never;
        /** @description Re-authenticates user and enables Sudo mode for the current session. */
        post: operations["enableUserSudoMode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Upload avatar of the logged-in user */
        put: operations["uploadUserAvatar"];
        post?: never;
        /** @description Delete avatar of the logged-in user */
        delete: operations["deleteUserAvatar"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{clientId}/addon/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Update billing addon
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        put: operations["updateBillingAddon"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/autocharge-options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Change client's payment options
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        put: operations["updateClientAutochargeOptions"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/available-addons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get addons available for client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["getClientAvailableAddons"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/credit-export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Export client credit information
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        post: operations["exportClientCredit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/payment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Create payment
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        post: operations["createPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/payment-source": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get client's payment sources
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getClientPaymentSources"];
        put?: never;
        /**
         * @description Create client payment source
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        post: operations["createClientPaymentSource"];
        /**
         * @description Delete client's payment source
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        delete: operations["deleteClientPaymentSource"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/promo-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get client's promo code redemption history
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getClientPromoCodeRedemptions"];
        put?: never;
        /**
         * @description Redeem a promo code
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        post: operations["redeemPromoCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/billing/client/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get client's billing status
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getClientStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/card-payment/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a single card payment.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["GetCardPayment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/card-payment/{id}/invoice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns invoice details
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getCardPaymentInvoice"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/card-payment/{id}/invoice/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns URL for downloading PDF invoice
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getCardPaymentInvoicePdf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/card-payment/invoice/file/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns PDF invoice file */
        get: operations["downloadInvoicePdfFile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/card-payment/stripe-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Process Stripe webhook notification */
        post: operations["processStripeWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Create new client
         *
         *     Disallowed access for following token types: `integration`
         */
        post: operations["createClient"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client-user/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the clientUser object
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["getClientUser"];
        /**
         * @description Modifies the connection between a client and a user
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["updateClientUserConnection"];
        post?: never;
        /**
         * @description Removes the connection between a client and a user
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        delete: operations["deleteClientUserConnection"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client-user/{id}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists all custom project roles assigned to the user
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["listUserProjectRoles"];
        /**
         * @description Sets custom project roles to the user. Admin role can not edit users with main role Owner or Admin.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["updateUserProjectRoles"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a single client. Requires canViewFinances flag because the response includes billing information.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getClient"];
        put?: never;
        post?: never;
        /**
         * @description Delete existing client, which must be empty (no projects, no services, no other users).
         *
         *     Allowed roles: `OWNER`
         *
         *     Disallowed access for following token types: `integration`
         */
        delete: operations["deleteClient"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/account-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Update client account information
         *
         *     Allowed roles: `OWNER`
         */
        put: operations["updateClientAccountInfo"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Update client avatar
         *
         *     Allowed roles: `OWNER`
         */
        put: operations["updateClientAvatar"];
        post?: never;
        /**
         * @description Delete client avatar
         *
         *     Allowed roles: `OWNER`
         */
        delete: operations["deleteClientAvatar"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/billing-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get client billing information
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["getClientBillingInfo"];
        /**
         * @description Update client billing information
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canEditFinances`
         */
        put: operations["updateClientBillingInfo"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/card-payment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists card payments under a client.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         *
         *     Required client user flag: `canViewFinances`
         */
        get: operations["ListClientCardPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/first-class-recipe/elk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Handles creation or upsert of ELK first-class recipe with log forwarding.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canCreateProjects`
         */
        put: operations["firstClassRecipeElk"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/first-class-recipe/prometheus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Handles creation or upsert of Prometheus first-class recipe with metrics forwarding.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canCreateProjects`
         */
        put: operations["firstClassRecipePrometheus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Create new integration token for client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        post: operations["createIntegrationToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/{tokenId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get integration token for client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["getIntegrationToken"];
        /**
         * @description Update integration token for client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Disallowed access for following token types: `integration`
         */
        put: operations["updateIntegrationToken"];
        post?: never;
        /**
         * @description Delete integration token
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Disallowed access for following token types: `integration`
         */
        delete: operations["deleteIntegrationToken"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/{tokenId}/delegation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description List integration token delegations for one token.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["listOneTokenIntegrationTokenDelegations"];
        put?: never;
        /**
         * @description Create a new token delegation.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Disallowed access for following token types: `integration`
         */
        post: operations["createIntegrationTokenDelegation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/{tokenId}/delegation/{delegationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Get a token delegation detail.
         *     Delegations allow integration token to create another integration token with pre-defined scope.
         *     New token is created under the user who created the delegation (so they are the token owner).
         *     This is used for e.g. ZCP, when it needs to create and initialize a production environment during a hand-over phase.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["getIntegrationTokenDelegation"];
        put?: never;
        post?: never;
        /**
         * @description Create a new token delegation.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Disallowed access for following token types: `integration`
         */
        delete: operations["deleteIntegrationTokenDelegation"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/{tokenId}/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Regenerate integration token secret while preserving all existing settings (role, scope, etc.).
         *     This is a convenience alternative to deleting and recreating the token with the same configuration.
         *     If an Owner or Admin user regenerates a token of another user, they will become the new owner of that token.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Disallowed access for following token types: `integration`
         */
        put: operations["regenerateIntegrationToken"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/delegation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description List all integration token delegations.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["listAllIntegrationTokenDelegations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/integration-token/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description List integration tokens for client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["listIntegrationTokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/project": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists projects user has access to under a client.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["ListClientProjects"];
        put?: never;
        /**
         * @description Creates a project.
         *     Users with role below Admin must have 'canCreateProjects' permission. They will then automatically receive Owner permission on any project they create.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canCreateProjects`
         */
        post: operations["CreateProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/project/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates a project based on its YAML format configuration.
         *     Users with role below Admin must have 'canCreateProjects' permission. They will then automatically receive Owner permission on any project they create.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         *
         *     Required client user flag: `canCreateProjects`
         */
        post: operations["ImportProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/project/tag/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists all tags used on all client's projects
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["ListProjectTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/projects-by-name/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Retrieves client projects by name.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["GetClientProjectsByName"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns collections of enumerations needed for GUI, tailored to the client in a single summary response */
        get: operations["GetClientSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/settings/stack-type/{stackTypeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns detailed information about specific service type, tailored to the client. */
        get: operations["GetClientSettingsStackType"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates a new client user connection. Admin can create only users with role of BASIC_USER and below.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        post: operations["createClientUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/user-notification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists user notifications under a client.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListClientUserNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/user/connect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Assigns user to a client. Admin can assign only users with role of BASIC_USER and below.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["ConnectUserToClient"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/user/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the list of all users connected to the client
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`, `NO_ACCESS`
         */
        get: operations["getClientUserList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/client/{id}/user/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Validates the possibility of connecting a user to a client.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        post: operations["validateClientUserConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/auth-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns URL for user authorization in GitHub */
        get: operations["getGithubAuthUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/repository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Loads the list of repositories for the logged-in user */
        get: operations["getGithubRepositories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/repository-branch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Loads the list of branches for a given repository */
        get: operations["getGithubRepositoryBranches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/sudo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Re-authenticates user and enables Sudo mode for the current session using GitHub OAuth */
        post: operations["authorizeSudoModeViaGithub"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/sudo-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns URL for user sudo authorization via GitHub */
        get: operations["getGithubSudoUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/user-login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Logs in a user based on previous GitHub authorization */
        post: operations["loginGithubUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/user-registration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Registers a user based on previous GitHub authorization */
        post: operations["registerGithubUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/github/user-repository-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Authorizes access to user repositories based on previous GitHub authorization */
        post: operations["authorizeGithubRepositoryAccess"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/auth-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns URL for user authorization in Gitlab */
        get: operations["getGitlabAuthUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/repository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Loads the list of repositories for the logged-in user */
        get: operations["getGitlabRepositories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/repository-branch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Loads the list of branches for a given repository */
        get: operations["getGitlabRepositoryBranches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/sudo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Re-authenticates user and enables Sudo mode for the current session using GitLab OAuth */
        post: operations["authorizeSudoModeViaGitlab"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/sudo-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns URL for user sudo authorization via GitLab */
        get: operations["getGitlabSudoUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/user-login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Logs in a user based on previous Gitlab authorization */
        post: operations["loginGitlabUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/user-registration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Registers a user based on previous Gitlab authorization */
        post: operations["registerGitlabUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/gitlab/user-repository-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Authorizes access to user repositories based on previous Gitlab authorization */
        post: operations["authorizeGitlabRepositoryAccess"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/process/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns information about the selected process
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProcessDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/process/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Cancels the user's process
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["CancelUserProcess"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project-env/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns information about the project environment.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectEnv"];
        /**
         * @description Updates the project environment.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateProjectEnv"];
        post?: never;
        /**
         * @description Deletes the project environment.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteProjectEnv"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project-env/{id}/reveal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the decrypted value of a sensitive project env item. Requires sudo mode.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        get: operations["GetProjectEnvSensitiveValue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns project details.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectDetails"];
        /**
         * @description Updates a project
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["UpdateProject"];
        post?: never;
        /**
         * @description Deletes a project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        delete: operations["DeleteProject"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/backup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists backups of all service stacks in the project, including backups of service stacks that were already deleted.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectBackups"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/backup/{serviceStackId}/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Updates values of specified backup of a service stack in the project, the service stack may already be deleted.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateProjectBackup"];
        post?: never;
        /**
         * @description Deletes specified backup of a service stack in the project, the service stack may already be deleted.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteProjectBackup"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/backup/download-url/{serviceStackId}/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates a temporary download url for the specified backup of a service stack in the project, the service stack may already be deleted.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateProjectBackupDownloadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/core-stack/prometheus-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Sets prometheus service discovery config for projects core stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ConfigurePrometheus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/env": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns project environment variables
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectEnvs"];
        put?: never;
        /**
         * @description Creates a new project environment record.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateProjectEnv"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/env-file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Return project environment file
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectEnvFile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/env-file-download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Return raw project environment file
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectEnvFileDownload"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/env/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Updates the project environment file.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateProjectEnvFile"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Exports project configuration into YAML format
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ExportProject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/first-class-recipe/development-container": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Handles creation of development container (or Zerops plane control), integration token and updates of project isolation envs.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["firstClassRecipeDevelopmentContainer"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/l7httpbalancer-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Return project L7 HTTP balancer config
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectL7httpbalancerConfig"];
        /**
         * @description Set project L7 HTTP balancer config
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["PutProjectL7httpbalancerConfig"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns project logs.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectLog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/mode-upgrade": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Upgrades project mode.
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["PutProjectModeUpgrade"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/process": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists processes under a project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectProcesses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/project-env/env-file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the user defined project environment variables of the requested category as an env file, in the exact form "PUT /project/{id}/env/file" accepts back. Covers project environment variables only, not the environment variables of the project's services. Sensitive values are decrypted, which requires sudo mode.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        get: operations["GetProjectEnvFileForEdit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/public-http-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists public HTTP routings under a project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectPublicHttpRoutings"];
        put?: never;
        /**
         * @description Creates public HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreatePublicHttpRouting"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/public-ipv4-shared": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Enables or disables usage of public shared ipv4 for the project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["PutProjectPublicIpV4Shared"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/remote-logging": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Configures remote logging of project logger container
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ConfigureRemoteLogging"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/request-ipv4": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Creates an IPv4 request
         *
         *     Allowed roles: `OWNER`, `ADMIN`
         */
        put: operations["RequestIpv4"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/revert-changes-public-http-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Reverts HTTP routing changes
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["RevertPublicHttpRoutingChanges"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/revert-changes-public-port-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Reverts port routing changes
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["RevertPublicPortRoutingChanges"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/service-stack": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists service stacks under a project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectServiceStacks"];
        put?: never;
        /**
         * @description Creates a standard service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateServiceStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/service-stack/{serviceStackTypeVersionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @deprecated
         * @description Deprecated. Use "POST /project/{id}/service-stack" instead. Creates a standard service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateStandardServiceStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/service-stack/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates service stack based on its YAML format configuration
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["ImportServiceStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/service-stack/object_storage_v1": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates an object storage service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateObjectStorageV1"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @deprecated
         * @description Starts the project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["StartProject"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @deprecated
         * @description Stops the project.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["StopProject"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/sync-public-http-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Synchronizes HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["SyncPublicHttpRouting"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/sync-public-port-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Synchronizes port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["SyncPublicPortRouting"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/vpn": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates VPN public key setup
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateProjectVpn"];
        /**
         * @description Deletes VPN public key
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteProjectVpn"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/vpn/{base64PublicKey}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Gets public key VPN setup by key
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetProjectVpnByKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/vpn/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Gets public key VPN setup list
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListProjectVpn"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/promo-code/{code}/flow": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get the redemption flow of a promo code */
        get: operations["getPromoCodeFlow"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-http-routing/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns public HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetPublicHttpRouting"];
        /**
         * @description Updates public HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdatePublicHttpRouting"];
        post?: never;
        /**
         * @description Deletes public HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeletePublicHttpRouting"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-http-routing/{id}/location": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Updates public HTTP routing locations
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdatePublicHttpRoutingLocation"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-http-routing/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Restores public HTTP routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["RestorePublicHttpRouting"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-http-routing/{id}/trigger-domains-dns-check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Triggers DNS check of domains of the public HTTP routing.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["TriggerPublicHttpRoutingDomainsDnsCheck"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-port-routing/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns public port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetPublicPortRouting"];
        /**
         * @description Updates public port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdatePublicPortRouting"];
        post?: never;
        /**
         * @description Deletes public port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeletePublicPortRouting"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/public-port-routing/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Restores public port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["RestorePublicPortRouting"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/recipe/{id}/data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Return recipe detail */
        get: operations["data"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/recipe/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Return public recipe info. */
        get: operations["info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/region": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of available regions */
        get: operations["GetRegions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/region/zcli": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns a list of regions for Zerops CLI */
        get: operations["GetZcliRegions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/registration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Registers a user */
        post: operations["RegisterUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack-by-name/{projectId}/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns service stack by project ID and name
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetServiceStackByName"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns service stack details
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetServiceStack"];
        put?: never;
        post?: never;
        /**
         * @description Deletes a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteServiceStack"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/app-version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists application versions under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["listServiceStackAppVersions"];
        put?: never;
        /**
         * @description Create new application version
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["createAppVersion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/autoscaling": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Setup service stack autoscaling parameters
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ConfigureAutoscaling"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/backup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists all service stack backups
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListBackups"];
        put?: never;
        /**
         * @description Triggers backup of service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["BackupServiceStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/backup-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Sets BACKUP_PERIOD env, retention policies, and triggers user data sync if needed
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ConfigureBackup"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/backup/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @deprecated
         * @description Deprecated. Use "PUT /project/{id}/backup/{serviceStackId}/{date}" instead. Updates values of specified backup of service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateBackup"];
        post?: never;
        /**
         * @deprecated
         * @description Deprecated. Use "DELETE /project/{id}/backup/{serviceStackId}/{date}" instead. Deletes specified backup of service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteBackup"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/backup/download-url/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @deprecated
         * @description Deprecated. Use "POST /project/{id}/backup/download-url/{serviceStackId}/{date}" instead. Create download temporary url for the specified service stack backup
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateDownloadBackupUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/build-cache": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * @description Deletes build cache for service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteBuildCache"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/cdn": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Enables CDN for object storage
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["EnableStorageCdn"];
        post?: never;
        /**
         * @description Disables CDN for object storage
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DisableStorageCdn"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/container": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists containers under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListServiceStackContainers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/debug": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Sets service stack debug values
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ConfigureDebug"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/disable-subdomain-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Disable service stack subdomain access
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["DisableSubdomainAccess"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/enable-subdomain-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Enable service stack subdomain access
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["EnableSubdomainAccess"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/env": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns service stack environment variables
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetServiceStackEnvList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Exports service stack configuration into YAML format
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ExportServiceStack"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/external-repository-integration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Sets up external repository integration
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["SetupExternalRepositoryIntegration"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/external-repository-integration-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns status of external repository integration
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetExternalRepositoryIntegrationStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/file-browsing-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates file browsing access for service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateFileBrowsingAccess"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/github-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Handles GitHub webhook events */
        post: operations["HandleGithubWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/gitlab-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Handles GitLab webhook events */
        post: operations["HandleGitlabWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/next-app-version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Decides if next deploy should use custom image
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["SetNextAppVersion"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/nginx-conf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns Nginx configuration for the service stack if applicable
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetNginxConfFile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/object-storage-size": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns object storage size for a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetObjectStorageSize"];
        /**
         * @description Updates object storage size for a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateObjectStorageSize"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/process": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists processes under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListServiceStackProcesses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/public-port-routing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists public port routings under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListServiceStackPublicPortRoutings"];
        put?: never;
        /**
         * @description Creates public port routing
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreatePublicPortRouting"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/reload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Reloads a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["ReloadServiceStack"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/restart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Restarts a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["RestartServiceStack"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/service": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists services under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListServiceStackServices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Starts a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["StartServiceStack"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Stops a service stack
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["StopServiceStack"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/trigger-external-repository-integration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Triggers external repository integration
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["TriggerExternalRepositoryIntegration"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/trigger-pipeline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Triggers new pipeline
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["PutTriggerPipeline"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/ui-access": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Creates access to the web UI a service stack serves from its containers
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateServiceStackUiAccess"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/user-data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Lists user data records under a service stack.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["ListServiceStackUserData"];
        put?: never;
        /**
         * @description Create a new userData record
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        post: operations["CreateUserData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/user-data/env-file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the user defined userData of the requested category as an env file, in the exact form the matching PUT accepts back. Sensitive values are decrypted, which requires sudo mode.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        get: operations["GetUserDataEnvFileForEdit"];
        /**
         * @description Update userData environment file
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateUserDataEnvFile"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/zerops-yaml-validation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Validates zerops.yaml in input body */
        post: operations["ValidateZeropsYaml"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @deprecated
         * @description Deprecated, use /client/{id}/settings. Returns collections of enumerations needed for GUI in a single summary response
         */
        get: operations["GetSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings/country-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns country list */
        get: operations["GetCountryList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings/import-project-yaml-json-schema.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns JSON schema for project import YAML validation */
        get: operations["GetImportProjectYamlJsonSchema"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings/import-project-yml-json-schema.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns JSON schema for project import YAML validation */
        get: operations["GetImportProjectYmlJsonSchema"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings/zerops-yaml-json-schema.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns JSON schema for zerops.yaml validation */
        get: operations["GetZeropsYmlJsonSchema"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/settings/zerops-yml-json-schema.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns JSON schema for zerops.yaml validation */
        get: operations["GetZeropsYamlJsonSchema"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-data/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns information about userData
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetUserDataById"];
        /**
         * @description Update userData by ID
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["UpdateUserDataById"];
        post?: never;
        /**
         * @description Delete userData by ID
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        delete: operations["DeleteUserDataById"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-data/{id}/reveal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns the decrypted value of a sensitive userData item. Requires sudo mode.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        get: operations["GetUserDataSensitiveValue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-notification/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * @description Returns a single user notification.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`, `READ_ONLY`
         */
        get: operations["GetUserNotification"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-notification/{id}/acknowledge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Acknowledge a specific user notification */
        put: operations["AcknowledgeUserNotification"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-notification/acknowledge-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Acknowledge all user notifications */
        put: operations["AcknowledgeAllUserNotifications"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Create a new user token
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["CreateUserToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-token/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get a user token detail */
        get: operations["GetUserToken"];
        /**
         * @description Rename existing user token
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        put: operations["RenameUserToken"];
        post?: never;
        /**
         * @description Delete a user token by ID
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        delete: operations["DeleteUserTokenById"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user-token/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List existing user tokens */
        get: operations["ListUserTokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Updates user information */
        put: operations["UpdateUser"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/{id}/send-verification-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Re-sends verification e-mail
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        put: operations["ReSendVerificationEmail"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/authorize-client": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Authorizes request to assign user to a client */
        put: operations["AuthorizeClient"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/client-list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Lists organizations (clients) the logged-in user is an active member of, including the user's role in each. */
        get: operations["ListUserClients"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns information about the logged-in user. */
        get: operations["GetUserInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Changes user password
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        put: operations["ChangePassword"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/password-via-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Changes user password using token */
        put: operations["ChangePasswordViaToken"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/recover-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** @description Initiates password change process by sending an e-mail */
        put: operations["RecoverPassword"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/user/verify-email/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Verifies user e-mail based on the temporary token in the URL */
        get: operations["VerifyUserEmail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/webauthn/login/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Finish FIDO2 login ceremony */
        post: operations["fido2LoginCeremonyFinish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/webauthn/login/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Begin FIDO2 login ceremony */
        post: operations["fido2LoginCeremonyStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/webauthn/registration/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Finish FIDO2 device registration ceremony
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["fido2RegistrationCeremonyFinish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/webauthn/registration/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * @description Begin FIDO2 device registration ceremony
         *
         *     Disallowed access for following token types: `personal`, `integration`
         */
        post: operations["fido2RegistrationCeremonyStart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/zcli/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Returns latest ZCLI version */
        get: operations["GetZcliVersion"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/project/{id}/purge-cdn/static/{domain}/{path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Purge objects in static CDN for given domain, everything in path after '.../{domain}/' will be applied to purge.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["PurgeStaticCdn"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/rest/public/service-stack/{id}/purge-cdn/{path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * @description Purge objects in storage CDN, everything in path after '.../purge-cdn/' will be applied to purge.
         *
         *     Allowed roles: `OWNER`, `ADMIN`, `BASIC_USER`
         */
        put: operations["PurgeStorageCdn"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        BaseAppVersionBuild: {
            /** Format: UUIDShort */
            cacheSnapshotId?: string | null;
            /** Format: dateTime */
            containerCreationStart?: string | null;
            /** Format: dateTime */
            endDate?: string | null;
            /** Format: dateTime */
            pipelineFailed?: string | null;
            /** Format: dateTime */
            pipelineFinish?: string | null;
            /** Format: dateTime */
            pipelineStart?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            serviceStackName?: string | null;
            /** Format: id */
            serviceStackTypeVersionId?: string | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            serviceStackTypeVersionName?: string | null;
            /** Format: dateTime */
            startDate?: string | null;
        };
        BaseAppVersionGithubIntegration: {
            branchName?: string | null;
            commit: string;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            pusher: string;
            repositoryFullName: string;
            tagName?: string | null;
            tagRegex?: string | null;
            zeropsYamlSetup?: string | null;
        };
        BaseAppVersionGitlabIntegration: {
            branchName?: string | null;
            commit: string;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            pusher: string;
            repositoryFullName: string;
            tagName?: string | null;
            tagRegex?: string | null;
            zeropsYamlSetup?: string | null;
        };
        BaseAppVersionJsonObject: {
            /** Format: dateTime */
            activationDate?: string | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            base?: string | null;
            build?: components["schemas"]["BaseAppVersionBuild"];
            /** Format: text */
            configContent?: string | null;
            /** Format: dateTime */
            created?: string | null;
            createdByUser?: components["schemas"]["BaseUserJsonObject"];
            githubIntegration?: components["schemas"]["BaseAppVersionGithubIntegration"];
            gitlabIntegration?: components["schemas"]["BaseAppVersionGitlabIntegration"];
            /** Format: UUIDShort */
            id: string;
            name?: string | null;
            /** @deprecated */
            os?: string | null;
            prepareCustomRuntime?: components["schemas"]["BasePrepareCustomRuntime"];
            /** Format: UUIDShort */
            projectId?: string | null;
            publicGitSource?: components["schemas"]["BaseAppVersionPublicGitSource"];
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /**
             * @default CLI
             * @enum {string}
             */
            source: "CLI" | "GUI" | "GITHUB" | "GITLAB" | "GIT" | "NONE";
            /**
             * @default UPLOADING
             * @enum {string|null}
             */
            status: "UPLOADING" | "WAITING_TO_DEPLOY" | "DEPLOYING" | "DEPLOY_FAILED" | "ACTIVE" | "BACKUP" | "BUILDING" | "WAITING_TO_BUILD" | "BUILD_FAILED" | "PREPARING_RUNTIME" | "PREPARING_RUNTIME_FAILED" | "BUILD_VALIDATION_FAILED" | "CANCELLED" | null;
            /** Format: text */
            zeropsYamlJson?: string | null;
        };
        BaseAppVersionPublicGitSource: {
            branchName: string;
            configContentFromImport: boolean;
            explicitSetup?: boolean | null;
            gitUrl: string;
        };
        BaseAppVersionUserData: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            editable: boolean;
            internal: boolean;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            sensitive: boolean;
            /**
             * @description Odfiltrovat záznamy userData.type == INTERNAL na výstupu /search
             * @default USER
             * @enum {string}
             */
            type: "READ_ONLY" | "EDITABLE" | "SECRET" | "INTERNAL" | "ENV" | "USER" | "SYSTEM";
        };
        BaseAutoTopUp: {
            /** Format: decimal */
            amount: string;
            /** Format: decimal */
            calendarMonthlyLimit: string;
            /** Format: decimal */
            threshold: string;
        };
        BaseClientAvatar: {
            externalAvatarUrl?: string | null;
            largeAvatarUrl?: string | null;
            smallAvatarUrl?: string | null;
        };
        BaseCustomAutoscaling: {
            horizontalAutoscalingNullable?: components["schemas"]["BaseHorizontalAutoscalingNullable"];
            verticalAutoscalingNullable?: components["schemas"]["BaseVerticalAutoscalingNullable"];
        };
        BaseDomainCertificateInfo: {
            /** Format: stringArray */
            domainList: string[];
            registeredDomain: string;
            /** Format: dateTime */
            validFrom?: string | null;
            /** Format: dateTime */
            validTill?: string | null;
        };
        BaseDomainDnsCheckChallenge: {
            challengeHost: string;
            challengeUrl: string;
            /** Format: text */
            error?: string | null;
            /** Format: text */
            httpResponse?: string | null;
            /** Format: int */
            httpStatusCode?: number | null;
        };
        BaseDomainDnsCheckDetail: {
            /** Format: objectArray */
            challenges: components["schemas"]["BaseDomainDnsCheckChallenge"][];
            /** Format: stringArray */
            resolvedIpAddresses: string[];
            /** Format: stringArray */
            resolvedNameServers: string[];
            /** Format: text */
            wildcardCnameCheckError?: string | null;
        };
        BaseErrorObject: {
            code: string;
            message: string;
            /** Format: jsonRawMessage */
            meta?: Record<string, never> | null;
        };
        BaseHardwareResource: {
            /** Format: int */
            cpuCoreCount: number;
            /** Format: int */
            diskGBytes: number;
            /** Format: int */
            memoryMBytes: number;
        };
        BaseHorizontalAutoscaling: {
            /** Format: int */
            maxContainerCount: number;
            /** Format: int */
            minContainerCount: number;
        };
        BaseHorizontalAutoscalingNullable: {
            /** Format: int */
            maxContainerCount?: number | null;
            /** Format: int */
            minContainerCount?: number | null;
        };
        BaseIntegrationTokenDelegationPermission: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: objectArray */
            projectPermissions: components["schemas"]["BaseIntegrationTokenDelegationProjectPermission"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description The token created with this delegation is in sudo mode.
             * @default false
             */
            sudo: boolean;
        };
        BaseIntegrationTokenDelegationProjectPermission: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        BaseLocationServiceStackInfo: {
            serviceStackName: string;
            serviceStackTypeName: string;
            serviceStackTypeVersionName: string;
        };
        BasePrepareCustomRuntime: {
            /** Format: dateTime */
            containerCreationStart?: string | null;
            /** Format: dateTime */
            endDate?: string | null;
            reason?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            serviceStackName?: string | null;
            /** Format: dateTime */
            startDate?: string | null;
        };
        BaseProjectLightJsonObject: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            name: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "DELETING" | "FAILED" | "STOPPING" | "STOPPED" | "STARTING";
            /** Format: stringArray */
            tagList: string[];
        };
        BasePrometheusServiceDiscovery: {
            /**
             * Format: map
             * @description Labels to add to each target. Both key and value must be strings.
             * @example {
             *       "app": "custom-app-label",
             *       "env": "dev"
             *     }
             */
            labels: Record<string, never>;
            /**
             * Format: stringArray
             * @description List of targets to scrape in format: <host>:<port>. Do not include scheme or path, all targets must use `/metrics` path.
             * @example [
             *       "example.com",
             *       "domain.tld:9090",
             *       "123.123.123.123:9090"
             *     ]
             */
            targets: string[];
        };
        BasePublicHttpRoutingDomain: {
            beingInstalledSslCertificate?: components["schemas"]["BaseDomainCertificateInfo"];
            /**
             * @default DISABLED
             * @enum {string}
             */
            cdnStatus: "DISABLED" | "BEING_INSTALLED" | "ACTIVE" | "BEING_DISABLED";
            deployedSslCertificate?: components["schemas"]["BaseDomainCertificateInfo"];
            /**
             * @default PENDING
             * @enum {string}
             */
            dnsCheckStatus: "PENDING" | "CHECKING" | "OK" | "FAILED";
            domainName: string;
            /** @enum {string|null} */
            hostMatch?: "EXACT" | "SANDBOX_PREFIX" | null;
            /** Format: dateTime */
            lastDnsCheckAt?: string | null;
            lastDnsCheckDetail?: components["schemas"]["BaseDomainDnsCheckDetail"];
            /** Format: dateTime */
            nextDnsCheckAt?: string | null;
            /** Format: mediumText */
            sslCertificateInstallationError?: string | null;
            /**
             * @default INACTIVE
             * @enum {string}
             */
            sslStatus: "INACTIVE" | "WAITING_FOR_DNS" | "BEING_INSTALLED" | "BEING_RENEWED" | "ACTIVE";
        };
        BasePublicHttpRoutingLocation: {
            config?: components["schemas"]["BasePublicHttpRoutingLocationConfig"];
            path: string;
            /** Format: int */
            port: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            serviceStackInfo: components["schemas"]["BaseLocationServiceStackInfo"];
        };
        BasePublicHttpRoutingLocationAccessPolicy: {
            /** Format: stringArray */
            cidr: string[];
            /**
             * @default allow
             * @enum {string}
             */
            defaultPolicy: "allow" | "deny";
            /** @default false */
            enabled: boolean;
            /** @default X-Forwarded-For */
            realIpHeader: string | null;
            /** Format: stringArray */
            setRealIpFrom?: string[] | null;
        };
        BasePublicHttpRoutingLocationBasicAuth: {
            /** @default false */
            enabled: boolean;
            /** Format: emptyString */
            realm: string;
            /** Format: objectArray */
            users: components["schemas"]["BasePublicHttpRoutingLocationBasicAuthUser"][];
        };
        BasePublicHttpRoutingLocationBasicAuthUser: {
            /** Format: emptyString */
            comment: string;
            /** Format: emptyString */
            password: string;
            /** Format: emptyString */
            username: string;
        };
        BasePublicHttpRoutingLocationConfig: {
            accessPolicy?: components["schemas"]["BasePublicHttpRoutingLocationAccessPolicy"];
            basicAuth?: components["schemas"]["BasePublicHttpRoutingLocationBasicAuth"];
            content?: components["schemas"]["BasePublicHttpRoutingLocationContent"];
            rateLimiting?: components["schemas"]["BasePublicHttpRoutingLocationRateLimiting"];
            redirect?: components["schemas"]["BasePublicHttpRoutingLocationRedirect"];
        };
        BasePublicHttpRoutingLocationContent: {
            /**
             * Format: int
             * @default 200
             */
            code: number;
            /**
             * Format: text
             * @default Hello world!
             */
            content: string;
            /**
             * Format: emptyString
             * @default application/octet-stream
             */
            contentType: string;
            /** @default false */
            enabled: boolean;
        };
        BasePublicHttpRoutingLocationRateLimiting: {
            /**
             * Format: int
             * @default 10
             */
            burst: number;
            /** @default false */
            enabled: boolean;
            /**
             * @default binary_remote_addr
             * @enum {string}
             */
            key: "binary_remote_addr" | "server_name";
            /**
             * Format: int
             * @default 10
             */
            rate: number;
            /**
             * Format: emptyString
             * @default mainzone
             */
            zone: string;
            /**
             * Format: int
             * @default 10
             */
            zoneSize: number;
        };
        BasePublicHttpRoutingLocationRedirect: {
            /**
             * Format: int
             * @default 302
             */
            code: number;
            /** @default false */
            enabled: boolean;
            /** @default false */
            preservePath: boolean;
            /** @default false */
            preserveQuery: boolean;
            /** Format: emptyString */
            to: string;
        };
        BaseRequestedPortsJsonObject: {
            isActive: boolean;
            /** Format: objectArray */
            requestedPorts: components["schemas"]["BaseServicePort"][];
        };
        BaseScalingMinFreeResource: {
            /** Format: float */
            cpuCoreCount: number;
            /** Format: float */
            cpuCorePercent: number;
            /** Format: float */
            memoryGBytes: number;
            /** Format: float */
            memoryPercent: number;
        };
        BaseScalingMinFreeResourceNullable: {
            /** Format: float */
            cpuCoreCount?: number | null;
            /** Format: float */
            cpuCorePercent?: number | null;
            /** Format: float */
            memoryGBytes?: number | null;
            /** Format: float */
            memoryPercent?: number | null;
        };
        BaseScalingResource: {
            /** Format: int */
            cpuCoreCount: number;
            /** Format: float */
            diskGBytes: number;
            /** Format: float */
            memoryGBytes: number;
        };
        BaseScalingResourceNullable: {
            /** Format: int */
            cpuCoreCount?: number | null;
            /** Format: float */
            diskGBytes?: number | null;
            /** Format: float */
            memoryGBytes?: number | null;
        };
        BaseServicePort: {
            /** Format: emptyString */
            description: string;
            /** @default false */
            httpRouting: boolean | null;
            /** Format: int */
            port: number;
            /** @default false */
            portRouting: boolean | null;
            /**
             * @default tcp
             * @enum {string}
             */
            protocol: "tcp" | "udp";
            /** @enum {string} */
            scheme: "tcp" | "udp" | "http" | "https" | "redis" | "mysql" | "postgresql" | "nats" | "clickhouse";
            /**
             * Format: UUIDShort
             * @description = service.id in Zerops Infrastructure
             */
            serviceId?: string | null;
        };
        BaseServiceStackInfoJsonObject: {
            /**
             * @default CORE
             * @enum {string}
             */
            serviceStackTypeCategory: "CORE" | "HTTP_L7_BALANCER" | "STANDARD" | "USER" | "LOCAL_STORAGE" | "OBJECT_STORAGE" | "BUILD" | "INTERNAL" | "PREPARE_RUNTIME";
            serviceStackTypeName: string;
            serviceStackTypeVersionName: string;
        };
        BaseServiceStackLightJsonObject: {
            /** Format: dateTime */
            created: string;
            /** Format: id */
            driverId?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: objectArray */
            ports: components["schemas"]["BaseServicePort"][];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: id */
            serviceStackTypeId: string;
            serviceStackTypeInfo: components["schemas"]["BaseServiceStackInfoJsonObject"];
            /** Format: id */
            serviceStackTypeVersionId: string;
        };
        BaseUserAvatar: {
            externalAvatarUrl?: string | null;
            largeAvatarUrl?: string | null;
            smallAvatarUrl?: string | null;
        };
        BaseUserJsonObject: {
            avatar?: components["schemas"]["BaseUserAvatar"];
            /** Format: email */
            email?: string | null;
            firstName?: string | null;
            fullName?: string | null;
            /** Format: UUIDShort */
            id?: string | null;
            /** @enum {string} */
            type: "GITHUB" | "GITLAB" | "USER" | "SYSTEM" | "INTEGRATION_TOKEN";
        };
        BaseVerticalAutoscaling: {
            /** @enum {string} */
            cpuMode: "DEDICATED" | "SHARED";
            maxResource: components["schemas"]["BaseScalingResource"];
            minFreeResource: components["schemas"]["BaseScalingMinFreeResource"];
            minResource: components["schemas"]["BaseScalingResource"];
            /** Format: int */
            startCpuCoreCount: number;
            swapEnabled: boolean;
        };
        BaseVerticalAutoscalingNullable: {
            /** @enum {string|null} */
            cpuMode?: "DEDICATED" | "SHARED" | null;
            maxResource?: components["schemas"]["BaseScalingResourceNullable"];
            minFreeResource?: components["schemas"]["BaseScalingMinFreeResourceNullable"];
            minResource?: components["schemas"]["BaseScalingResourceNullable"];
            /** Format: int */
            startCpuCoreCount?: number | null;
            swapEnabled?: boolean | null;
        };
        /** Format: error */
        Error: {
            code?: string;
            message?: string;
        };
        InDtoBodyBackupRetentionPolicy: {
            /**
             * Format: int
             * @description Maximum backups with tag [daily] to keep.
             */
            maxDaily: number;
            /**
             * Format: int
             * @description Maximum backups with tag [monthly] to keep.
             */
            maxMonthly: number;
            /**
             * Format: int
             * @description Max amount of files to keep.
             *     Any files above will be periodically deleted.
             *     Respects minDaily, minWeekly and minMonthly configuration.
             */
            maxTotalFiles: number;
            /**
             * Format: int
             * @description Max size all files combined may occupy in GiB.
             *     If limit is reached, oldest files are deleted first.
             *     Respects minDaily, minWeekly and minMonthly configuration.
             */
            maxTotalGiB: number;
            /**
             * Format: int
             * @description Maximum backups with tag [weekly] to keep.
             */
            maxWeekly: number;
            /**
             * Format: int
             * @description Minimum backups with tag [daily] to keep.
             */
            minDaily: number;
            /**
             * Format: int
             * @description Minimum backups with tag [monthly] to keep.
             */
            minMonthly: number;
            /**
             * Format: int
             * @description Minimum backups with tag [weekly] to keep.
             */
            minWeekly: number;
            /**
             * Format: stringArray
             * @description Files with protected tags will never be automatically deleted.
             * @example [
             *       "custom-tag-1",
             *       "second-protected-tag"
             *     ]
             */
            protectedTags: string[];
        };
        InDtoBodyClientIntegrationTokenProjectAccess: {
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        InDtoBodyClientUserProjectRole: {
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        InDtoBodyCustomAutoscaling: {
            horizontalAutoscaling?: components["schemas"]["BaseHorizontalAutoscalingNullable"];
            verticalAutoscaling?: components["schemas"]["BaseVerticalAutoscalingNullable"];
        };
        InDtoBodyGithubIntegration: {
            branchName?: string | null;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            isActive: boolean;
            repositoryFullName: string;
            tagRegex?: string | null;
            triggerBuild: boolean;
            zeropsYamlSetup?: string | null;
        };
        InDtoBodyGitlabIntegration: {
            branchName?: string | null;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            isActive: boolean;
            repositoryFullName: string;
            tagRegex?: string | null;
            triggerBuild: boolean;
            zeropsYamlSetup?: string | null;
        };
        InDtoBodyIntegrationTokenDelegationProjectPermission: {
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        InDtoBodyProjectEnvItem: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
        };
        InDtoBodyProjectUserRole: {
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        InDtoBodyPublicHttpRoutingLocation: {
            config?: components["schemas"]["BasePublicHttpRoutingLocationConfig"];
            path: string;
            /** Format: int */
            port: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
        };
        InDtoBodyPutProjectL7httpbalancerConfigValue: {
            name: string;
            value?: string | null;
        };
        InDtoBodyPutProjectUserRoles: {
            /**
             * Format: objectArray
             * @description If the provided array is empty, existing user roles for the project will be removed.
             */
            userRoles: components["schemas"]["InDtoBodyProjectUserRole"][];
        };
        InDtoBodyUserDataPut: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** @default false */
            sensitive: boolean;
        };
        InDtoBodyWebAuthnLoginVerification: {
            /**
             * Format: jsonRawMessage
             * @description Response from the FIDO2 authenticator.
             */
            response: Record<string, never>;
            /**
             * Format: UUIDShort
             * @description Session ID of the FIDO2 verification ceremony.
             */
            sessionId: string;
        };
        InDtoBodyWebAuthnPublicKeyCredential: {
            authenticatorAttachment: string;
            /** Format: map */
            clientExtensionResults: Record<string, never>;
            id: string;
            rawId: string;
            /** @description Response from the FIDO2 authenticator. */
            response: Record<string, never>;
            type: string;
        };
        OutDtoAddon: {
            addonName: string;
            metricId: string;
            /** Format: UUIDShort */
            projectId?: string | null;
            /** Format: float */
            unitPrice: number;
            userEnabled: boolean;
            /** Format: dateTime */
            validFrom: string;
            /** Format: dateTime */
            validTill: string;
        };
        OutDtoAppVersionGithubIntegration: {
            branchName?: string | null;
            commit: string;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            pusher: string;
            repositoryFullName: string;
            tagName?: string | null;
            tagRegex?: string | null;
            zeropsYamlSetup?: string | null;
        };
        OutDtoAppVersionGitlabIntegration: {
            branchName?: string | null;
            commit: string;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            pusher: string;
            repositoryFullName: string;
            tagName?: string | null;
            tagRegex?: string | null;
            zeropsYamlSetup?: string | null;
        };
        OutDtoAuth: {
            accessToken: string;
            /**
             * Format: UUIDShort
             * @description Underlying userId regardless of the authentication method. For regular authentication, this is the same as userId. For integration tokens, this is the userId of the token owner.
             */
            actualUserId: string;
            author: components["schemas"]["OutDtoAuthor"];
            /** Format: dateTime */
            expiresAt: string;
            /** Format: int */
            expiresIn: number;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
            tokenType: string;
            /**
             * Format: stringArray
             * @description If the value is set, user has 2FA enabled. Valid values are:
             *     TOTP - a time-based one-time password second factor
             *     U2F - a standard key-based second factor
             *
             *     Note:
             *     FIDO2 (Passkey) is not a second factor, it fully replaces passwords and need for 2FA.
             *     "twoFAVerified" will be automatically set to true if the user logged in using a Passkey.
             */
            twoFAMethods?: string[] | null;
            /**
             * @description If the value is false, user has 2FA enabled, and the login wasn't verified yet.
             * @default false
             */
            twoFAVerified: boolean | null;
            /**
             * Format: UUIDShort
             * @description For regular authentication, this is the userId of the user. For integration tokens, this is the userId of the token itself.
             */
            userId: string;
        };
        OutDtoAuthFull: {
            accessToken: string;
            /**
             * Format: UUIDShort
             * @description Underlying userId regardless of the authentication method. For regular authentication, this is the same as userId. For integration tokens, this is the userId of the token owner.
             */
            actualUserId: string;
            author: components["schemas"]["OutDtoAuthor"];
            /** Format: dateTime */
            expiresAt: string;
            /** Format: int */
            expiresIn: number;
            /** @description Application tokens do not have refresh tokens, only standard login tokens have them. */
            refreshToken?: string | null;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
            tokenType: string;
            /**
             * Format: stringArray
             * @description If the value is set, user has 2FA enabled. Valid values are:
             *     TOTP - a time-based one-time password second factor
             *     U2F - a standard key-based second factor
             *
             *     Note:
             *     FIDO2 (Passkey) is not a second factor, it fully replaces passwords and need for 2FA.
             *     "twoFAVerified" will be automatically set to true if the user logged in using a Passkey.
             */
            twoFAMethods?: string[] | null;
            /**
             * @description If the value is false, user has 2FA enabled, and the login wasn't verified yet.
             * @default false
             */
            twoFAVerified: boolean | null;
            /**
             * Format: UUIDShort
             * @description For regular authentication, this is the userId of the user. For integration tokens, this is the userId of the token itself.
             */
            userId: string;
        };
        OutDtoAuthLogin: {
            auth: components["schemas"]["OutDtoAuthFull"];
            /** @description If user has 2FA enabled, this field will be null until user has passed 2FA verification. */
            user?: components["schemas"]["OutDtoUser"];
        };
        OutDtoAuthor: {
            /** Format: UUIDShort */
            authorId: string;
            /** @default CLIENT */
            authorType: string;
        };
        OutDtoAutoTopUp: {
            /** Format: decimal */
            amount: string;
            /** Format: decimal */
            calendarMonthlyLimit: string;
            /** Format: decimal */
            threshold: string;
        };
        OutDtoBackupRetentionPolicy: {
            /**
             * Format: int
             * @description Maximum backups with tag [daily] to keep.
             */
            maxDaily: number;
            /**
             * Format: int
             * @description Maximum backups with tag [monthly] to keep.
             */
            maxMonthly: number;
            /**
             * Format: int
             * @description Max amount of files to keep.
             *     Any files above will be periodically deleted.
             *     Respects minDaily, minWeekly and minMonthly configuration.
             */
            maxTotalFiles: number;
            /**
             * Format: int
             * @description Max size all files combined may occupy in GiB.
             *     If limit is reached, oldest files are deleted first.
             *     Respects minDaily, minWeekly and minMonthly configuration.
             */
            maxTotalGiB: number;
            /**
             * Format: int
             * @description Maximum backups with tag [weekly] to keep.
             */
            maxWeekly: number;
            /**
             * Format: int
             * @description Minimum backups with tag [daily] to keep.
             */
            minDaily: number;
            /**
             * Format: int
             * @description Minimum backups with tag [monthly] to keep.
             */
            minMonthly: number;
            /**
             * Format: int
             * @description Minimum backups with tag [weekly] to keep.
             */
            minWeekly: number;
            /**
             * Format: stringArray
             * @description Files with protected tags will never be automatically deleted.
             * @example [
             *       "custom-tag-1",
             *       "second-protected-tag"
             *     ]
             */
            protectedTags: string[];
        };
        OutDtoBillingInfo: {
            companyName: string;
            companyNumber?: string | null;
            invoiceAddressCity: string;
            /**
             * Format: id
             * @example CZ
             */
            invoiceAddressCountryId: string;
            invoiceAddressPostcode: string;
            invoiceAddressStreet: string;
            /**
             * Format: id
             * @example CZ
             */
            vatCountryId: string;
            /** @enum {string} */
            vatMode: "DOMESTIC_VAT_PAYER" | "DOMESTIC_NOT_VAT_PAYER" | "EU_REVERSE_CHARGE" | "EU_MOSS" | "EU_NOT_VAT_PAYER" | "NOT_EU" | "NOT_EU_VERIFIED";
            vatNumber?: string | null;
            /** Format: float */
            vatRate: number;
            vatVerified: boolean;
        };
        OutDtoBuildCache: {
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            buildServiceStackId: string;
            configChecksum: string;
            /** Format: UUIDShort */
            snapshotId: string;
        };
        OutDtoCardPayment: {
            /**
             * Format: decimal
             * @description Amount without VAT
             */
            amount: string;
            /**
             * Format: decimal
             * @description Amount that contains a VAT tax
             */
            amountVat: string;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: id */
            currencyId: string;
            /** Format: dateTime */
            datePaid?: string | null;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description OFFSESSION musí obsahovat i requestId.
             * @default ONSESSION
             * @enum {string}
             */
            interactionType: "ONSESSION" | "OFFSESSION";
            /** Format: UUIDShort */
            invoiceId?: string | null;
            /** Format: dateTime */
            lastUpdate: string;
            /** @description Stripe source_id - zdroj, odkud se mají prostředky strhnout. */
            paymentMethod?: string | null;
            /** @description Id requestu, který payment vyvolal - offsession platby. */
            requestId?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "PROCESSING" | "PROCESSING_FAILED" | "PAYMENT_DECLINED" | "PAYMENT_DECLINE_FAILED" | "PAYMENT_SUCCESS" | "BALANCE_UPDATED" | "BALANCE_UPDATE_FAILED" | "INVOICED" | "INVOICING_FAILED" | "FINISHED" | "CANCELED" | "DECLINED";
            /** Format: UUIDShort */
            userId?: string | null;
        };
        OutDtoClientInfoLanguageObject: {
            id: string;
        };
        OutDtoClientInfoObject: {
            companyName: string;
            companyNumber?: string | null;
            /** Format: dateTime */
            created: string;
            currency: components["schemas"]["OutDtoClientInfoObjectCurrency"];
            id: string;
            language: components["schemas"]["OutDtoClientInfoLanguageObject"];
            /** Format: dateTime */
            lastPublicUpdate: string;
            /** Format: dateTime */
            lastUpdate: string;
            status: string;
            vatCountry: string;
            vatMode?: string | null;
            vatNumber?: string | null;
            vatPayer: boolean;
            /** Format: float */
            vatRate: number;
        };
        OutDtoClientInfoObjectCurrency: {
            displaySymbolBefore: boolean;
            id: string;
            /** Format: int */
            roundDigits: number;
            symbol: string;
        };
        OutDtoClientIntegrationToken: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: dateTime */
            created: string;
            /**
             * Format: UUIDShort
             * @description User that invited this user, if any. In case of integration tokens, this is the token creator.
             */
            createdByUser?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            name: string;
            /** Format: objectArray */
            projects: components["schemas"]["OutDtoClientIntegrationTokenProjectAccess"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
        };
        OutDtoClientIntegrationTokenDelegation: {
            /**
             * Format: UUIDShort
             * @description ID of the client to which the token will be bound
             */
            clientId: string;
            /**
             * Format: UUIDShort
             * @description ID of the user granting the permission
             */
            clientUserId: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /**
             * Format: UUIDShort
             * @description ID of the integration token, to which the permission was granted
             */
            tokenId: string;
            tokenPermissions: components["schemas"]["BaseIntegrationTokenDelegationPermission"];
            /**
             * Format: UUIDShort
             * @description ID of the user granting the permission
             */
            userId: string;
        };
        OutDtoClientIntegrationTokenProjectAccess: {
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        OutDtoClientLight: {
            accountName: string;
            avatar?: components["schemas"]["BaseClientAvatar"];
            /** Format: UUIDShort */
            id: string;
        };
        OutDtoClientPromoCodeRedemption: {
            /** Format: decimal */
            bonusCreditAmount: string;
            code: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: UUIDShort */
            promoCodeId: string;
        };
        OutDtoClientUserExtra: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /** @enum {string} */
            status: "WAITING_AUTHORIZATION" | "ACTIVE";
            user: components["schemas"]["OutDtoUserLight"];
            /** Format: UUIDShort */
            userId: string;
        };
        OutDtoClientUserExtraWithClientLight: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            client: components["schemas"]["OutDtoClientLight"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /** @enum {string} */
            status: "WAITING_AUTHORIZATION" | "ACTIVE";
            user: components["schemas"]["OutDtoUserLight"];
            /** Format: UUIDShort */
            userId: string;
        };
        OutDtoClientUserProjectRole: {
            /** Format: UUIDShort */
            id: string;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        OutDtoContainer: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            currentHardwareResource: components["schemas"]["BaseHardwareResource"];
            hostname?: string | null;
            /**
             * Format: UUIDShort
             * @description =container.Id in zerops infrastructure
             */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            name?: string | null;
            /** Format: int */
            number: number;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * Format: UUIDShort
             * @description = service.id in Zerops Infrastructure
             */
            serviceId: string;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /**
             * @default CREATING
             * @enum {string}
             */
            status: "CREATING" | "ACTIVE" | "DELETING" | "FAILED" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "MOVING" | "ACTION_FAILED" | "MOVING_STOPPED";
        };
        OutDtoCountry: {
            /**
             * Format: id
             * @example CZ
             */
            id: string;
            inEu: boolean;
            name: string;
        };
        OutDtoCurrency: {
            displaySymbolBefore: boolean;
            /** Format: id */
            id: string;
            /** Format: int */
            roundDigits: number;
            symbol: string;
        };
        OutDtoCustomAutoscaling: {
            horizontalAutoscaling?: components["schemas"]["BaseHorizontalAutoscalingNullable"];
            verticalAutoscaling?: components["schemas"]["BaseVerticalAutoscalingNullable"];
        };
        OutDtoGetAppVersion: {
            /** Format: dateTime */
            activationDate?: string | null;
            build?: components["schemas"]["BaseAppVersionBuild"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            createdByUser?: components["schemas"]["BaseUserJsonObject"];
            githubIntegration?: components["schemas"]["OutDtoAppVersionGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoAppVersionGitlabIntegration"];
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            publicGitSource?: components["schemas"]["BaseAppVersionPublicGitSource"];
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /**
             * @default CLI
             * @enum {string}
             */
            source: "CLI" | "GUI" | "GITHUB" | "GITLAB" | "GIT" | "NONE";
            /**
             * @default UPLOADING
             * @enum {string}
             */
            status: "UPLOADING" | "WAITING_TO_DEPLOY" | "DEPLOYING" | "DEPLOY_FAILED" | "ACTIVE" | "BACKUP" | "BUILDING" | "WAITING_TO_BUILD" | "BUILD_FAILED" | "PREPARING_RUNTIME" | "PREPARING_RUNTIME_FAILED" | "BUILD_VALIDATION_FAILED" | "CANCELLED";
            /** Format: objectArray */
            userDataList: components["schemas"]["BaseAppVersionUserData"][];
        };
        OutDtoGetRecipeEnvironment: {
            content: string;
            /** Format: map */
            extracts: Record<string, never>;
            import: string;
            name: string;
            projectName: string;
            /** Format: objectArray */
            services: components["schemas"]["OutDtoGetRecipeService"][];
        };
        OutDtoGetRecipeService: {
            autoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            /**
             * @default CORE
             * @enum {string}
             */
            category: "CORE" | "HTTP_L7_BALANCER" | "STANDARD" | "USER" | "LOCAL_STORAGE" | "OBJECT_STORAGE" | "BUILD" | "INTERNAL" | "PREPARE_RUNTIME";
            content?: string | null;
            exactVersionNumber: string;
            /** Format: map */
            extracts: Record<string, never>;
            gitRepo?: string | null;
            isUtility: boolean;
            name: string;
            /** Format: int */
            objectStorageSize?: number | null;
            /** Format: objectArray */
            ports: components["schemas"]["OutDtoServicePort"][];
            /** Format: id */
            typeId: string;
            typeName: string;
            /** Format: id */
            typeVersionId: string;
            typeVersionName: string;
            zeropsYaml?: string | null;
        };
        OutDtoGithubIntegration: {
            authorizationRequired: boolean;
            branchName?: string | null;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            isActive: boolean;
            repositoryFullName: string;
            tagRegex?: string | null;
            userId: string;
            /** Format: int */
            webhookId?: number | null;
            zeropsYamlSetup?: string | null;
        };
        OutDtoGitlabIntegration: {
            authorizationRequired: boolean;
            branchName?: string | null;
            /** @enum {string} */
            eventType: "BRANCH" | "TAG";
            isActive: boolean;
            repositoryFullName: string;
            tagRegex?: string | null;
            userId: string;
            /** Format: int */
            webhookId?: number | null;
            zeropsYamlSetup?: string | null;
        };
        OutDtoLanguage: {
            /** Format: id */
            id: string;
            name: string;
        };
        OutDtoLocation: {
            /** Format: id */
            id: string;
            name: string;
            pingUrl: string;
        };
        OutDtoPaymentSource: {
            addressCity: string;
            addressCountry: string;
            addressLine1: string;
            addressLine1Check: string;
            addressLine2: string;
            addressState: string;
            addressZip: string;
            addressZipCheck: string;
            brand: string;
            country: string;
            cvcCheck: string;
            expMonth: string;
            expYear: string;
            funding: string;
            id: string;
            last4: string;
            /** Format: map */
            metadata: Record<string, never>;
            name: string;
            object: string;
            tokenizationMethod: string;
        };
        OutDtoProcess: {
            actionName: string;
            appVersion?: components["schemas"]["BaseAppVersionJsonObject"];
            canceledByUser?: components["schemas"]["BaseUserJsonObject"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            createdBySystem: boolean;
            createdByUser: components["schemas"]["BaseUserJsonObject"];
            error?: components["schemas"]["BaseErrorObject"];
            /** Format: dateTime */
            finished?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            project?: components["schemas"]["BaseProjectLightJsonObject"];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: map */
            publicMeta?: Record<string, never> | null;
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /** Format: objectArray */
            serviceStacks: components["schemas"]["BaseServiceStackLightJsonObject"][];
            /** Format: dateTime */
            started?: string | null;
            /** @default PENDING */
            status: string;
        };
        OutDtoProject: {
            autoStartup: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            logForwardingType?: string | null;
            /**
             * @default LEGACY
             * @enum {string}
             */
            mode: "LIGHT" | "SERIOUS";
            name: string;
            primaryInstanceLocation: components["schemas"]["OutDtoLocation"];
            publicIpV4?: string | null;
            /** @default false */
            publicIpV4Shared: boolean;
            publicIpV6?: string | null;
            publicZone: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "DELETING" | "FAILED" | "STOPPING" | "STOPPED" | "STARTING";
            /** Format: stringArray */
            tagList: string[];
            /** Format: objectArray */
            userRoles: components["schemas"]["OutDtoProjectUserRole"][];
            zeropsSubdomainHost?: string | null;
        };
        OutDtoProjectBackup: {
            /**
             * Format: dateTime
             * @description Time when the backup was taken, parsed from name
             */
            created: string;
            /**
             * Format: map
             * @description Map with both key and value of string type
             */
            metadata: Record<string, never>;
            /** @description Name of the backup file in S3 (a date when it was taken) */
            name: string;
            /** @description Path to backup file inside S3 bucket (includes file name) */
            path: string;
            /** @description True when the service stack no longer exists, its backups are kept until deleted explicitly or the project is deleted */
            serviceStackDeleted: boolean;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /** @description Name of the service stack at the time the backup was taken */
            serviceStackName: string;
            /**
             * Format: int64
             * @description File size in bytes
             */
            size: number;
        };
        OutDtoProjectEnv: {
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /** Format: dateTime */
            created: string;
            /** @default true */
            editable: boolean;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            /** @default false */
            sensitive: boolean;
            /**
             * @default USER
             * @enum {string}
             */
            type: "USER" | "SYSTEM";
        };
        OutDtoProjectImportServiceStack: {
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: objectArray */
            processes: components["schemas"]["OutDtoProcess"][];
        };
        OutDtoProjectL7httpbalancerConfigValue: {
            current?: string | null;
            default: string;
            name: string;
        };
        OutDtoProjectLight: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /**
             * @default LEGACY
             * @enum {string}
             */
            mode: "LIGHT" | "SERIOUS";
            name: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "DELETING" | "FAILED" | "STOPPING" | "STOPPED" | "STARTING";
            /** Format: stringArray */
            tagList: string[];
            /** Format: objectArray */
            userRoles: components["schemas"]["OutDtoProjectUserRole"][];
        };
        OutDtoProjectUserRole: {
            /** Format: UUIDShort */
            clientUserId: string;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        OutDtoProjectVpnPeerSetup: {
            ipv4: components["schemas"]["OutDtoVpnIpConfig"];
            ipv6: components["schemas"]["OutDtoVpnIpConfig"];
            publicKey: string;
            setup: string;
            setupLinux: string;
            setupMacOS: string;
            setupWindows: string;
        };
        OutDtoProjectVpnSetup: {
            ipv4: components["schemas"]["OutDtoVpnConfig"];
            ipv6: components["schemas"]["OutDtoVpnConfig"];
            publicKey: string;
        };
        OutDtoPublicHttpRouting: {
            /** @default false */
            cdnEnabled: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            deleteOnSync: boolean;
            /** Format: objectArray */
            domains: components["schemas"]["BasePublicHttpRoutingDomain"][];
            /** Format: UUIDShort */
            id: string;
            isEditable: boolean;
            isSynced: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: objectArray */
            locations: components["schemas"]["BasePublicHttpRoutingLocation"][];
            /** Format: UUIDShort */
            projectId: string;
            sslEnabled: boolean;
        };
        OutDtoPublicPortRouting: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            deleteOnSync: boolean;
            firewallAllowMyIp: boolean;
            /** Format: stringArray */
            firewallIpRanges: string[];
            /**
             * @default BLACKLIST
             * @enum {string}
             */
            firewallPolicy: "BLACKLIST" | "WHITELIST";
            /** Format: UUIDShort */
            id: string;
            /** Format: int */
            internalPort: number;
            /**
             * @default tcp
             * @enum {string}
             */
            internalProtocol: "tcp" | "udp";
            isSynced: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @default IP_V4
             * @enum {string}
             */
            publicIpType: "IP_V4" | "IP_V6";
            /** Format: int */
            publicPort: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
        };
        OutDtoRegion: {
            address: string;
            isDefault: boolean;
            name: string;
        };
        OutDtoService: {
            /** @default false */
            billingEnabled: boolean;
            /**
             * @default EMPTY
             * @enum {string}
             */
            category: "EMPTY" | "MASTER" | "LOGGER" | "HTTP_L7_BALANCER" | "APPLICATION_BALANCER" | "DATABASE" | "MESSAGE_BROKER" | "USER_APPLICATION" | "SHARED_STORAGE" | "LOCAL_STORAGE" | "SYSTEM" | "BUILD" | "PREPARE_RUNTIME" | "METRIC";
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /**
             * Format: UUIDShort
             * @description = service.id in Zerops Infrastructure
             */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            stackAccessPoint: boolean;
            /**
             * @default CREATING
             * @enum {string}
             */
            status: "CREATING" | "ACTIVE" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "DELETING" | "DELETED" | "FAILED" | "ACTION_FAILED" | "REPAIRING" | "CONTAINER_FAILED" | "MOVING_CONTAINER" | "UPGRADING" | "SCALING" | "REPAIR_FAILED";
            /** Format: int */
            targetContainerCount: number;
        };
        OutDtoServicePort: {
            /** Format: emptyString */
            description: string;
            /** Format: int */
            port: number;
            /**
             * @default tcp
             * @enum {string}
             */
            protocol: "tcp" | "udp";
            /** @enum {string} */
            scheme: "tcp" | "udp" | "http" | "https" | "redis" | "mysql" | "postgresql" | "nats" | "clickhouse";
        };
        OutDtoServiceStack: {
            activeAppVersion?: components["schemas"]["OutDtoGetAppVersion"];
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: map
             * @description List of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            base: string;
            buildCache?: components["schemas"]["OutDtoBuildCache"];
            /** @default false */
            cdnEnabled: boolean;
            coreService?: components["schemas"]["OutDtoServiceStackLight"];
            /** Format: dateTime */
            created: string;
            currentAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customPortsEnabled: boolean;
            githubIntegration?: components["schemas"]["OutDtoGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoGitlabIntegration"];
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            isSystem: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** @deprecated */
            mode?: string | null;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: id */
            nestId: string;
            /** Format: objectArray */
            ports: components["schemas"]["BaseServicePort"][];
            project: components["schemas"]["OutDtoProjectLight"];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            reloadAvailable: boolean;
            requestedPorts: components["schemas"]["BaseRequestedPortsJsonObject"];
            /** Format: id */
            serviceStackTypeId: string;
            serviceStackTypeInfo: components["schemas"]["BaseServiceStackInfoJsonObject"];
            /**
             * Format: id
             * @deprecated
             * @description Deprecated. Replaced by `base` field
             */
            serviceStackTypeVersionId: string;
            startOnProjectStart: boolean;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "DELETING" | "DELETED" | "FAILED" | "ACTION_FAILED" | "UPGRADING" | "READY_TO_DEPLOY" | "SERVICE_CREATING" | "SERVICE_ACTIVE" | "SERVICE_STOPPING" | "SERVICE_STOPPED" | "SERVICE_STARTING" | "SERVICE_RESTARTING" | "SERVICE_RELOADING" | "SERVICE_DELETING" | "SERVICE_DELETED" | "SERVICE_FAILED" | "SERVICE_ACTION_FAILED" | "SERVICE_REPAIRING" | "SERVICE_CONTAINER_FAILED" | "SERVICE_MOVING_CONTAINER" | "SERVICE_UPGRADING" | "SERVICE_SCALING" | "SERVICE_REPAIR_FAILED" | "REPAIRING" | "CONTAINER_FAILED" | "MOVING_CONTAINER" | "SCALING" | "REPAIR_FAILED";
            subdomainAccess: boolean;
            /** Format: objectArray */
            userData: components["schemas"]["OutDtoUserData"][];
            /** Format: emptyString */
            versionNumber: string;
        };
        OutDtoServiceStackBackupFile: {
            /**
             * Format: map
             * @description Map with both key and value of string type
             * @example {
             *       "filename": "backup-sharedstorage0-2024-07-01 10:17:07.tar.gz",
             *       "stackname": "sharedstorage0",
             *       "mode": "AUTOMATIC",
             *       "tags": [
             *         "daily",
             *         "weekly",
             *         "monthly"
             *       ]
             *     }
             */
            metadata: Record<string, never>;
            /**
             * @description Name of the backup file in S3 (a date when it was taken)
             * @example 2024-07-01 09:00:06
             */
            name: string;
            /**
             * @description Path to backup file inside S3 bucket (includes file name)
             * @example mRF6FX3uRGiDUkKdKyEJdQ/2024-07-01 09:00:06
             */
            path: string;
            /**
             * Format: int64
             * @description File size in bytes
             * @example 399
             */
            size: number;
        };
        OutDtoServiceStackEnv: {
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            sensitive: boolean;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /**
             * @description Odfiltrovat záznamy userData.type == INTERNAL na výstupu /search
             * @default USER
             * @enum {string}
             */
            type: "READ_ONLY" | "EDITABLE" | "SECRET" | "INTERNAL" | "ENV" | "USER" | "SYSTEM";
        };
        OutDtoServiceStackLight: {
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            base: string;
            buildCache?: components["schemas"]["OutDtoBuildCache"];
            /** @default false */
            cdnEnabled: boolean;
            currentAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            githubIntegration?: components["schemas"]["OutDtoGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoGitlabIntegration"];
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            isSystem: boolean;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: id */
            nestId: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /** Format: id */
            serviceStackTypeId: string;
            serviceStackTypeInfo: components["schemas"]["BaseServiceStackInfoJsonObject"];
            /**
             * Format: id
             * @deprecated
             * @description Deprecated. Replaced by `base` field
             */
            serviceStackTypeVersionId: string;
            startOnProjectStart: boolean;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "DELETING" | "DELETED" | "FAILED" | "ACTION_FAILED" | "UPGRADING" | "READY_TO_DEPLOY" | "SERVICE_CREATING" | "SERVICE_ACTIVE" | "SERVICE_STOPPING" | "SERVICE_STOPPED" | "SERVICE_STARTING" | "SERVICE_RESTARTING" | "SERVICE_RELOADING" | "SERVICE_DELETING" | "SERVICE_DELETED" | "SERVICE_FAILED" | "SERVICE_ACTION_FAILED" | "SERVICE_REPAIRING" | "SERVICE_CONTAINER_FAILED" | "SERVICE_MOVING_CONTAINER" | "SERVICE_UPGRADING" | "SERVICE_SCALING" | "SERVICE_REPAIR_FAILED" | "REPAIRING" | "CONTAINER_FAILED" | "MOVING_CONTAINER" | "SCALING" | "REPAIR_FAILED";
        };
        OutDtoServiceStackType: {
            /**
             * @default CORE
             * @enum {string}
             */
            category: "CORE" | "HTTP_L7_BALANCER" | "STANDARD" | "USER" | "LOCAL_STORAGE" | "OBJECT_STORAGE" | "BUILD" | "INTERNAL" | "PREPARE_RUNTIME";
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description: string;
            docsUrl: string;
            hasAccessDetails: boolean;
            hasBackup: boolean;
            hasConfiguration: boolean;
            hasUiAccess: boolean;
            /** Format: id */
            id: string;
            isBuild: boolean;
            isManaged: boolean;
            isRuntime: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: stringArray */
            modeList: string[];
            name: string;
            /** Format: stringArray */
            osList: string[];
            /** Format: objectArray */
            serviceStackTypeVersionList: components["schemas"]["OutDtoServiceStackTypeVersionLight"][];
            subcategory: string;
        };
        OutDtoServiceStackTypeProfile: {
            customAutoscaling: components["schemas"]["OutDtoCustomAutoscaling"];
            description: string;
            id: string;
            isDefault: boolean;
            name: string;
            /** Format: int */
            order: number;
            /** @description Names and data types of values which can be manually configured by the user. Used to override or expand values generated by the system. */
            overrides: components["schemas"]["OutDtoServiceStackTypeProfileOverrides"];
        };
        OutDtoServiceStackTypeProfileOverrides: {
            dataType: string;
            description: string;
            name: string;
        };
        OutDtoServiceStackTypeVersion: {
            config: components["schemas"]["OutDtoStackTypeConfig"];
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description: string;
            /** Format: emptyString */
            exactVersionNumber: string;
            /** Format: id */
            id: string;
            isBuild: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            mode?: string | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            name: string;
            os?: string | null;
            /** Format: dateTime */
            releaseDate: string;
            /** Format: id */
            serviceStackTypeId: string;
            /** @default ACTIVE */
            status: string;
            supportsVerticalAutoscaling: boolean;
            /** Format: emptyString */
            versionNumber: string;
        };
        OutDtoServiceStackTypeVersionLight: {
            /** Format: text */
            description: string;
            /** Format: emptyString */
            exactVersionNumber: string;
            /** Format: id */
            id: string;
            isBuild: boolean;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            name: string;
            /** Format: dateTime */
            releaseDate: string;
            /** Format: id */
            serviceStackTypeId: string;
            /** @default ACTIVE */
            status: string;
            /** Format: emptyString */
            versionNumber: string;
        };
        OutDtoStackTypeConfig: {
            /** Format: objectArray */
            autoscalingProfiles: components["schemas"]["OutDtoServiceStackTypeProfile"][];
            /** @description default values applied when not specified by the user */
            defaultAutoscaling?: components["schemas"]["BaseCustomAutoscaling"];
            defaultWebserverConfig?: string | null;
            /** @description maximum and minimum values of horizontal scaling */
            horizontalAutoscaling?: components["schemas"]["BaseHorizontalAutoscaling"];
            /** @description maximum and minimum values of vertical scaling */
            verticalAutoscaling?: components["schemas"]["BaseVerticalAutoscaling"];
        };
        OutDtoUser: {
            avatar?: components["schemas"]["BaseUserAvatar"];
            /** Format: objectArray */
            clientUserList: components["schemas"]["OutDtoClientUserExtraWithClientLight"][];
            /** Format: int */
            countryCallingCode?: number | null;
            /** Format: dateTime */
            created: string;
            /** Format: email */
            email: string;
            /** @default false */
            emailVerified: boolean;
            firstName: string;
            fullName: string;
            /** Format: UUIDShort */
            id: string;
            language: components["schemas"]["OutDtoLanguage"];
            /** Format: emptyString */
            lastName: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: int */
            phoneNumber?: number | null;
            /** @enum {string} */
            status: "ACTIVE" | "BANNED";
        };
        OutDtoUserData: {
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /** Format: dateTime */
            created: string;
            /** @default false */
            editable: boolean;
            /** Format: UUIDShort */
            id: string;
            /** @default false */
            internal: boolean;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            sensitive: boolean;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            serviceStackName: string;
            /**
             * @description Odfiltrovat záznamy userData.type == INTERNAL na výstupu /search
             * @default USER
             * @enum {string}
             */
            type: "READ_ONLY" | "EDITABLE" | "SECRET" | "INTERNAL" | "ENV" | "USER" | "SYSTEM";
        };
        OutDtoUserLight: {
            avatar?: components["schemas"]["BaseUserAvatar"];
            /** Format: email */
            email: string;
            /** @default false */
            emailVerified: boolean;
            firstName: string;
            fullName: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: emptyString */
            lastName: string;
        };
        OutDtoUserNotification: {
            /** Format: dateTime */
            actionCreated: string;
            /** Format: dateTime */
            actionFinished?: string | null;
            actionName: string;
            /** Format: dateTime */
            actionStarted?: string | null;
            appVersion?: components["schemas"]["BaseAppVersionJsonObject"];
            canceledByUser?: components["schemas"]["BaseUserJsonObject"];
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: UUIDShort
             * @description =container.Id in zerops infrastructure
             */
            containerId?: string | null;
            /** Format: int */
            containerNumber?: number | null;
            /** Format: dateTime */
            created: string;
            createdByUser: components["schemas"]["BaseUserJsonObject"];
            error?: components["schemas"]["BaseErrorObject"];
            /** @enum {string|null} */
            executorTag?: "MAIN" | "L7_MASTER" | null;
            /** Format: UUIDShort */
            id: string;
            project?: components["schemas"]["BaseProjectLightJsonObject"];
            /** Format: UUIDShort */
            projectId?: string | null;
            serviceName?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /** Format: objectArray */
            serviceStacks: components["schemas"]["BaseServiceStackLightJsonObject"][];
            /**
             * @default SUCCESS
             * @enum {string}
             */
            type: "SUCCESS" | "WARNING" | "ERROR";
        };
        OutDtoUserToken: {
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** @description User defined token name */
            name: string;
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
        };
        OutDtoVCSRepository: {
            admin: boolean;
            fullName: string;
            name: string;
            owner: string;
            ownerUrl: string;
            /** @enum {string} */
            visibility: "PUBLIC" | "PRIVATE";
        };
        OutDtoVCSRepositoryBranch: {
            isDefault: boolean;
            name: string;
        };
        OutDtoVpnConfig: {
            endpoint: string;
            network: components["schemas"]["OutDtoVpnNetworkConfig"];
            sharedEndpoint: string;
        };
        OutDtoVpnIpConfig: {
            assignedIpAddress: string;
            network: components["schemas"]["OutDtoVpnNetworkConfig"];
        };
        OutDtoVpnNetworkConfig: {
            gateway: string;
            network: string;
        };
        OutDtoWebAuthnCredential: {
            /** Format: dateTime */
            created: string;
            id: string;
            /**
             * @description Whether the credential is a Passkey (resident key) or a standard second factor (non-resident key).
             * @default false
             */
            isResident: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** @description User defined credential name (defaults to provider name derived from AAGUID) */
            name: string;
        };
        OutDtoWebAuthnOptions: {
            /** Format: jsonRawMessage */
            response: Record<string, never>;
            /** Format: UUIDShort */
            sessionId: string;
        };
        OutDtoZcliVersionAsset: {
            browser_download_url: string;
            content_type: string;
            /** Format: dateTime */
            created_at: string;
            /** Format: int */
            download_count: number;
            /** Format: int */
            id: number;
            label: string;
            name: string;
            node_id: string;
            /** Format: int */
            size: number;
            state: string;
            /** Format: dateTime */
            updated_at: string;
            uploader: components["schemas"]["OutDtoZcliVersionUploader"];
            url: string;
        };
        OutDtoZcliVersionAuthor: {
            avatar_url: string;
            events_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            gravatar_id: string;
            html_url: string;
            /** Format: int */
            id: number;
            login: string;
            node_id: string;
            organizations_url: string;
            received_events_url: string;
            repos_url: string;
            site_admin: boolean;
            starred_url: string;
            subscriptions_url: string;
            type: string;
            url: string;
            user_view_type: string;
        };
        OutDtoZcliVersionUploader: {
            avatar_url: string;
            events_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            gravatar_id: string;
            html_url: string;
            /** Format: int */
            id: number;
            login: string;
            node_id: string;
            organizations_url: string;
            received_events_url: string;
            repos_url: string;
            site_admin: boolean;
            starred_url: string;
            subscriptions_url: string;
            type: string;
            url: string;
            user_view_type: string;
        };
        RequestAuth: {
            /** Format: email */
            email: string;
            password: string;
        };
        RequestAuthRefresh: {
            /** @description Application tokens do not have refresh tokens, only standard login tokens have them. */
            refreshTokenId: string;
        };
        RequestAuthSudoVerification: {
            password?: string | null;
            /** @description TOTP token from the authenticator app or a recovery code. */
            token?: string | null;
            /** @description Accepts data from either FIDO2 (Passkey) or U2F ceremony. */
            webAuthn?: components["schemas"]["InDtoBodyWebAuthnLoginVerification"];
        };
        RequestAuthTOTP: {
            /** @description TOTP token from the authenticator app or a recovery code. */
            token: string;
        };
        RequestAutoscaling: {
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: jsonRawMessage
             * @description Json formatted list of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            customAutoscaling?: components["schemas"]["BaseCustomAutoscaling"];
        };
        RequestClientAuthorize: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: urlEncodedBase64Email */
            email: string;
            /** Format: UUIDShort */
            token: string;
        };
        RequestClientIntegrationToken: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            name: string;
            /** Format: objectArray */
            projects: components["schemas"]["InDtoBodyClientIntegrationTokenProjectAccess"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists. Enabling it requires the user to be in sudo mode.
             * @default false
             */
            sudo: boolean;
        };
        RequestClientUser: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /** Format: UUIDShort */
            userId: string;
        };
        RequestClientUserConnection: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        RequestClientUserProjectRoleList: {
            /** Format: objectArray */
            projectRoleList: components["schemas"]["InDtoBodyClientUserProjectRole"][];
        };
        RequestClientUserValidate: {
            /** Format: email */
            email: string;
        };
        RequestCoreStackPrometheusConfig: {
            /** Format: objectArray */
            configs: components["schemas"]["BasePrometheusServiceDiscovery"][];
            /** Format: UUIDShort */
            instanceId?: string | null;
        };
        RequestDeleteBillingClientPaymentSource: {
            /** Format: id */
            sourceId: string;
        };
        RequestDeviceLoginCheck: {
            /** @description Required for CONFIDENTIAL apps. */
            appSecret?: string | null;
            /**
             * @description Required for CONFIDENTIAL apps to collect the tokens, the app receives it on its callback URL.
             *     Send it only together with the pollSecret of the same browser session, otherwise a phished approval logs the attacker in.
             */
            code?: string | null;
            /** @description Returned only to the initiating app, required to collect the tokens. */
            pollSecret: string;
            /** Format: UUIDShort */
            requestId: string;
        };
        RequestDeviceLoginInitiate: {
            /**
             * @description Identifier the app sends when initiating a device login, e.g. zcli. Stays the same across environments.
             *     Only letters, digits, underscores and dashes.
             */
            appCode: string;
            /** @description Required for CONFIDENTIAL apps. */
            appSecret?: string | null;
        };
        RequestExternalRepositoryIntegration: {
            githubIntegration?: components["schemas"]["InDtoBodyGithubIntegration"];
            gitlabIntegration?: components["schemas"]["InDtoBodyGitlabIntegration"];
        };
        /** Format: binary */
        RequestFileUpload: string;
        RequestFirstClassRecipeDevelopmentContainer: {
            createIntegrationToken?: boolean | null;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /** Format: text */
            serviceImportYaml: string;
        };
        RequestFirstClassRecipeElk: {
            /** @deprecated */
            elasticsearchMode?: string | null;
            /** Format: UUIDShort */
            elkProjectId?: string | null;
            /** Format: UUIDShort */
            forwardLogsFromProjectId?: string | null;
            includeApm: boolean;
            includeLogstash: boolean;
            /**
             * @default LEGACY
             * @enum {string|null}
             */
            projectCorePackage: "LIGHT" | "SERIOUS" | null;
        };
        RequestFirstClassRecipePrometheus: {
            /** Format: UUIDShort */
            forwardMetricsFromProjectId: string;
            /** @deprecated */
            grafanaDatabaseMode?: string | null;
            /**
             * @default LEGACY
             * @enum {string|null}
             */
            projectCorePackage: "LIGHT" | "SERIOUS" | null;
            /** Format: UUIDShort */
            prometheusProjectId?: string | null;
        };
        RequestGithubAuth: {
            code: string;
            email?: string | null;
            promoCode?: string | null;
            state: string;
        };
        RequestGitlabAuth: {
            code: string;
            email?: string | null;
            promoCode?: string | null;
            state: string;
        };
        RequestIntegrationTokenDelegationPermission: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: objectArray */
            projectPermissions: components["schemas"]["InDtoBodyIntegrationTokenDelegationProjectPermission"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description The token created with this delegation is in sudo mode.
             * @default false
             */
            sudo: boolean;
        };
        RequestPostAppVersion: {
            name?: string | null;
        };
        RequestPostBillingCreditExport: {
            month: string;
        };
        RequestPostBillingPayment: {
            /** Format: decimal */
            amount: string;
            promoCode?: string | null;
            /** Format: id */
            sourceId?: string | null;
        };
        RequestPostClient: {
            accountName: string;
            reference?: string | null;
        };
        RequestPostObjectStorageServiceStack: {
            cdnEnabled?: boolean | null;
            /** Format: int */
            diskGBytes: number;
            /**
             * @description hostname
             *
             *     		Stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     		if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     		: domainName = inputDomainName || ".";
             *     		endif;
             *
             *     		if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(domainRecord.name > 255)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             * @example server1
             */
            name: string;
            policy?: string | null;
            /** Format: text */
            rawPolicy?: string | null;
        };
        RequestPostProject: {
            /** Format: text */
            description?: string | null;
            /** @description Defines which services may read the environment variables of a service. Values can be combined using spaces (e.g., service service@zcp). Allowed values: none (every service in the project sees them), service (only the service itself, the default), service@name (additionally the service named "name"), -service@name (the service named "name" is excluded even when none is set). Explicit variable referencing is still possible regardless of the isolation setting. Services inherit this value unless they set their own. */
            envIsolation?: string | null;
            /**
             * Format: objectArray
             * @default []
             */
            envSecrets: components["schemas"]["InDtoBodyProjectEnvItem"][];
            /**
             * Format: objectArray
             * @default []
             */
            envVariables: components["schemas"]["InDtoBodyProjectEnvItem"][];
            /** Format: id */
            location?: string | null;
            /** Format: decimal */
            maxCreditLimit?: string | null;
            /**
             * @default LIGHT
             * @enum {string|null}
             */
            mode: "LIGHT" | "SERIOUS" | null;
            name: string;
            /** @default false */
            publicIpV4Shared: boolean;
            /** @description Defines who is authorized to access the service via SSH. Values can be combined using spaces (e.g., project vpn). To exclude a specific access type, use a negative prefix (e.g., -vpn). Allowed values: project (anyone from the project), vpn (anyone from the VPN), service (anyone from the same service), service@name (anyone from the service named "name"). */
            sshIsolation?: string | null;
            /** Format: stringArray */
            tagList: string[];
            /** Format: objectArray */
            userRoles: components["schemas"]["InDtoBodyProjectUserRole"][];
        };
        RequestPostProjectVpn: {
            /** Format: UUIDShort */
            instanceId?: string | null;
            publicKey: string;
        };
        RequestPostServiceStack: {
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: jsonRawMessage
             * @description Json formatted list of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            /** @description Triggers the first build from the specified Git repository. When provided, the system will automatically initialize and build the service from the repository source code. */
            buildFromGit?: string | null;
            cdnEnabled?: boolean | null;
            customAutoscaling?: components["schemas"]["InDtoBodyCustomAutoscaling"];
            enableSubdomainAccess?: boolean | null;
            /** @description Defines which services may read the environment variables of a service. Values can be combined using spaces (e.g., service service@zcp). Allowed values: none (every service in the project sees them), service (only the service itself, the default), service@name (additionally the service named "name"), -service@name (the service named "name" is excluded even when none is set). Explicit variable referencing is still possible regardless of the isolation setting. When set at the service level, this value replaces the project-level setting for this service. */
            envIsolation?: string | null;
            /**
             * Format: text
             * @description Environment secrets in .env file format
             */
            envSecretsFile?: string | null;
            /**
             * Format: text
             * @description Environment variables in .env file format
             */
            envVarsFile?: string | null;
            /** Format: id */
            location?: string | null;
            /**
             * @description hostname
             *
             *     		Stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     		if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     		: domainName = inputDomainName || ".";
             *     		endif;
             *
             *     		if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(domainRecord.name > 255)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            serviceStackVersionName: string;
            /** @description Defines who is authorized to access the service via SSH. Values can be combined using spaces (e.g., project vpn). To exclude a specific access type, use a negative prefix (e.g., -vpn). Allowed values: project (anyone from the project), vpn (anyone from the VPN), service (anyone from the same service), service@name (anyone from the service named "name"). When set at the service level, these values override any project-level defined isolation settings. */
            sshIsolation?: string | null;
            startWithoutCode?: boolean | null;
            /**
             * Format: objectArray
             * @default []
             */
            userData: components["schemas"]["InDtoBodyUserDataPut"][];
            /**
             * Format: text
             * @deprecated
             * @description Environment variables in .env file format
             */
            userDataEnvFile?: string | null;
            /** @description Specifies the configuration setup name to use for the service. If omitted, the system will automatically use a setup configuration based on the service name. */
            zeropsSetup?: string | null;
            /**
             * Format: text
             * @description Defines custom YAML configuration for the service. Allows direct input of configuration in YAML format instead of using a predefined setup. If omitted, the system will look for a zerops.yaml file in the Git repository.
             */
            zeropsYaml?: string | null;
        };
        RequestPostServiceStackBackup: {
            /** Format: stringArray */
            tags?: string[] | null;
        };
        RequestPostServiceStackBackupModify: {
            /** Format: stringArray */
            tags?: string[] | null;
        };
        RequestPostStandardServiceStack: {
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: jsonRawMessage
             * @description Json formatted list of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            /** @description Triggers the first build from the specified Git repository. When provided, the system will automatically initialize and build the service from the repository source code. */
            buildFromGit?: string | null;
            cdnEnabled?: boolean | null;
            customAutoscaling?: components["schemas"]["InDtoBodyCustomAutoscaling"];
            enableSubdomainAccess?: boolean | null;
            /** @description Defines which services may read the environment variables of a service. Values can be combined using spaces (e.g., service service@zcp). Allowed values: none (every service in the project sees them), service (only the service itself, the default), service@name (additionally the service named "name"), -service@name (the service named "name" is excluded even when none is set). Explicit variable referencing is still possible regardless of the isolation setting. When set at the service level, this value replaces the project-level setting for this service. */
            envIsolation?: string | null;
            /**
             * Format: text
             * @description Environment secrets in .env file format
             */
            envSecretsFile?: string | null;
            /**
             * Format: text
             * @description Environment variables in .env file format
             */
            envVarsFile?: string | null;
            /** Format: id */
            location?: string | null;
            /** @deprecated */
            mode?: string | null;
            /**
             * @description hostname
             *
             *     		Stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     		if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     		: domainName = inputDomainName || ".";
             *     		endif;
             *
             *     		if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(domainRecord.name > 255)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             *
             *     		if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     		: EXCEPTION 400;
             *     		stop;
             *     		endif;
             * @example server1
             */
            name: string;
            os?: string | null;
            /** @description Defines who is authorized to access the service via SSH. Values can be combined using spaces (e.g., project vpn). To exclude a specific access type, use a negative prefix (e.g., -vpn). Allowed values: project (anyone from the project), vpn (anyone from the VPN), service (anyone from the same service), service@name (anyone from the service named "name"). When set at the service level, these values override any project-level defined isolation settings. */
            sshIsolation?: string | null;
            startWithoutCode?: boolean | null;
            /**
             * Format: objectArray
             * @default []
             */
            userData: components["schemas"]["InDtoBodyUserDataPut"][];
            /**
             * Format: text
             * @deprecated
             * @description Environment variables in .env file format
             */
            userDataEnvFile?: string | null;
            /** @description Specifies the configuration setup name to use for the service. If omitted, the system will automatically use a setup configuration based on the service name. */
            zeropsSetup?: string | null;
            /**
             * Format: text
             * @description Defines custom YAML configuration for the service. Allows direct input of configuration in YAML format instead of using a predefined setup. If omitted, the system will look for a zerops.yaml file in the Git repository.
             */
            zeropsYaml?: string | null;
        };
        RequestProjectEnvPost: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestProjectEnvPut: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestProjectEnvPutEnvFile: {
            /** Format: text */
            envFile: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestProjectImport: {
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /** Format: text */
            yaml: string;
        };
        RequestPromoCodeRedeem: {
            code: string;
        };
        RequestPublicHttpRoutingLocationPut: {
            /** Format: objectArray */
            locations: components["schemas"]["InDtoBodyPublicHttpRoutingLocation"][];
        };
        RequestPublicHttpRoutingPost: {
            /** @default false */
            cdnEnabled: boolean | null;
            /** Format: stringArray */
            domains: string[];
            /** Format: objectArray */
            locations: components["schemas"]["InDtoBodyPublicHttpRoutingLocation"][];
            sslEnabled: boolean;
        };
        RequestPublicHttpRoutingPut: {
            /** @default false */
            cdnEnabled: boolean | null;
            /** Format: stringArray */
            domains: string[];
            /** Format: objectArray */
            locations: components["schemas"]["InDtoBodyPublicHttpRoutingLocation"][];
            sslEnabled: boolean;
        };
        RequestPublicHttpRoutingPutTriggerDomainDnsCheck: {
            /** Format: stringArray */
            domains?: string[] | null;
        };
        RequestPublicPortRouting: {
            firewallAllowMyIp: boolean;
            /** Format: stringArray */
            firewallIpRanges: string[];
            /**
             * @default BLACKLIST
             * @enum {string}
             */
            firewallPolicy: "BLACKLIST" | "WHITELIST";
            /** Format: int */
            internalPort: number;
            /**
             * @default tcp
             * @enum {string}
             */
            internalProtocol: "tcp" | "udp";
            /**
             * @default IP_V4
             * @enum {string}
             */
            publicIpType: "IP_V4" | "IP_V6";
            /** Format: int */
            publicPort: number;
        };
        RequestPutAppVersion: {
            name?: string | null;
        };
        RequestPutAppVersionBuildAndDeploy: {
            /** Format: mediumText */
            zeropsYaml: string;
            zeropsYamlSetup?: string | null;
        };
        RequestPutAppVersionDeploy: {
            /** Format: mediumText */
            zeropsYaml?: string | null;
            zeropsYamlSetup?: string | null;
        };
        RequestPutBillingAddon: {
            enabled: boolean;
            recurringEnabled: boolean;
        };
        RequestPutBillingClientAutocharge: {
            autoTopUp?: components["schemas"]["BaseAutoTopUp"];
        };
        RequestPutClientAccountInfo: {
            accountName: string;
        };
        RequestPutClientBillingInfo: {
            companyName: string;
            companyNumber?: string | null;
            invoiceAddressCity: string;
            /**
             * Format: id
             * @example CZ
             */
            invoiceAddressCountryId: string;
            invoiceAddressPostcode: string;
            invoiceAddressStreet: string;
            vatNumber?: string | null;
        };
        RequestPutProject: {
            /** Format: text */
            description?: string | null;
            /** Format: decimal */
            maxCreditLimit?: string | null;
            name: string;
            /** @default false */
            publicIpV4Shared: boolean;
            /** Format: stringArray */
            tagList: string[];
            /** @description If set, will update the user roles for the project, if not, roles will remain unchanged. */
            userRoles?: components["schemas"]["InDtoBodyPutProjectUserRoles"];
        };
        RequestPutProjectL7httpbalancerConfig: {
            /** Format: objectArray */
            values: components["schemas"]["InDtoBodyPutProjectL7httpbalancerConfigValue"][];
        };
        RequestPutProjectModeUpgrade: {
            /**
             * @default LEGACY
             * @enum {string}
             */
            mode: "LIGHT" | "SERIOUS";
        };
        RequestPutProjectPublicIpV4Shared: {
            enabled: boolean;
        };
        RequestPutProjectRemoteLogging: {
            /** Format: text */
            certificate: string;
            /** Format: text */
            syslogConfig: string;
            type?: string | null;
        };
        RequestPutServiceStackDebug: {
            /** @enum {string|null} */
            debugBuild?: "NONE" | "BEFORE" | "ON_FAIL" | "AFTER" | null;
            /** @enum {string|null} */
            debugRuntimePrepare?: "NONE" | "BEFORE" | "ON_FAIL" | "AFTER" | null;
        };
        RequestPutServiceStackObjectStorageSize: {
            cdnEnabled?: boolean | null;
            /** Format: int */
            diskGBytes: number;
            policy?: string | null;
            /** Format: text */
            rawPolicy?: string | null;
        };
        RequestPutStandardServiceStackTriggerExternalRepositoryIntegration: {
            /**
             * Format: text
             * @description Environment secrets in .env file format
             */
            envSecretsFile?: string | null;
            /**
             * Format: text
             * @description Environment variables in .env file format
             */
            envVarsFile?: string | null;
            /**
             * Format: objectArray
             * @default []
             */
            userData: components["schemas"]["InDtoBodyUserDataPut"][];
            /**
             * Format: text
             * @deprecated
             * @description Environment secrets in .env file format
             */
            userDataEnvFile?: string | null;
        };
        RequestPutStandardServiceStackTriggerPipeline: {
            /** Format: UUIDShort */
            appVersionId?: string | null;
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /** @description Triggers the first build from the specified Git repository. When provided, the system will automatically initialize and build the service from the repository source code. */
            buildFromGit?: string | null;
            customAutoscaling?: components["schemas"]["InDtoBodyCustomAutoscaling"];
            enableSubdomainAccess?: boolean | null;
            /**
             * Format: text
             * @description Environment secrets in .env file format
             */
            envSecretsFile?: string | null;
            /**
             * Format: text
             * @description Environment variables in .env file format
             */
            envVarsFile?: string | null;
            /** @deprecated */
            mode?: string | null;
            startWithoutCode?: boolean | null;
            /**
             * Format: objectArray
             * @default []
             */
            userData: components["schemas"]["InDtoBodyUserDataPut"][];
            /**
             * Format: text
             * @deprecated
             * @description Environment secrets in .env file format
             */
            userDataEnvFile?: string | null;
            /** @description Specifies the configuration setup name to use for the service. If omitted, the system will automatically use a setup configuration based on the service name. */
            zeropsSetup?: string | null;
            /**
             * Format: text
             * @description Specifies the configuration setup  to use for the service. If omitted, the system will automatically use a setup configuration.
             */
            zeropsYaml?: string | null;
        };
        RequestRecoverPassword: {
            /** Format: email */
            email: string;
        };
        RequestServiceStackBackupConfig: {
            backupPeriod?: string | null;
            retentionPolicy?: components["schemas"]["InDtoBodyBackupRetentionPolicy"];
        };
        RequestServiceStackImport: {
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /** Format: text */
            yaml: string;
        };
        RequestServiceStackNextAppVersion: {
            useCustomRuntime: boolean;
        };
        RequestStripeWebhook: {
            /** Format: jsonRawMessage */
            object: Record<string, never>;
            type: string;
        };
        RequestTotpRegistrationVerification: {
            /** Format: UUIDShort */
            sessionId: string;
            token: string;
        };
        RequestUser: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: int */
            countryCallingCode?: number | null;
            /** Format: email */
            email: string;
            firstName: string;
            /** Format: emptyString */
            lastName: string;
            /** Format: int */
            phoneNumber?: number | null;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
        };
        RequestUserDataPost: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestUserDataPut: {
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestUserDataPutEnvFile: {
            /** Format: text */
            envFile: string;
            /** @default false */
            sensitive: boolean;
        };
        RequestUserNotification: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: UUIDShort */
            projectId?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
        };
        RequestUserPut: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: int */
            countryCallingCode?: number | null;
            firstName: string;
            /** Format: emptyString */
            lastName: string;
            /** Format: int */
            phoneNumber?: number | null;
        };
        RequestUserPutPassword: {
            /** @description New password. Set to null to remove password authentication and use only Passkey authentication. */
            newPassword?: string | null;
            /** @description Current password. Can be null if user only uses Passkey authentication and wants to set up a password. */
            oldPassword?: string | null;
        };
        RequestUserPutPasswordViaToken: {
            /** Format: email */
            email: string;
            password: string;
            /** Format: UUIDShort */
            token: string;
        };
        RequestUserRegistration: {
            accountName: string;
            /** Format: email */
            email: string;
            name: string;
            /** @description If provided, registration response will contain FIDO2 (Passkey) challenge, which needs to be completed and submitted to /webauthn/registration/finish endpoint. */
            passkey?: boolean | null;
            /** @description Password may be null if passkey is used. */
            password?: string | null;
            promoCode?: string | null;
            reference?: string | null;
            /**
             * Format: text
             * @description CloudFlare turnstile captcha token
             */
            token?: string | null;
        };
        RequestUserToken: {
            /** @description User defined token name */
            name: string;
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
        };
        RequestWebAuthnLoginVerification: {
            /**
             * Format: jsonRawMessage
             * @description Response from the FIDO2 authenticator.
             */
            response: Record<string, never>;
            /**
             * Format: UUIDShort
             * @description Session ID of the FIDO2 verification ceremony.
             */
            sessionId: string;
        };
        RequestWebAuthnRegistrationOptions: {
            /** @description Whether to register a Passkey (resident key) or a standard second factor (non-resident key). */
            residentKey: boolean;
        };
        RequestWebAuthnRegistrationVerification: {
            /** @description Custom name of the authenticator device. */
            deviceName: string;
            response: components["schemas"]["InDtoBodyWebAuthnPublicKeyCredential"];
            /**
             * Format: UUIDShort
             * @description Session ID of the FIDO2 verification ceremony.
             */
            sessionId: string;
        };
        RequestZeropsYamlValidation: {
            /**
             * @default DEPLOY
             * @enum {string}
             */
            operation: "DEPLOY" | "BUILD_AND_DEPLOY";
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            serviceStackName: string;
            /** Format: id */
            serviceStackTypeId: string;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            serviceStackTypeVersionName: string;
            /** Format: mediumText */
            zeropsYaml: string;
            zeropsYamlSetup?: string | null;
        };
        ResponseAppVersionList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoGetAppVersion"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseAuth: {
            accessToken: string;
            /**
             * Format: UUIDShort
             * @description Underlying userId regardless of the authentication method. For regular authentication, this is the same as userId. For integration tokens, this is the userId of the token owner.
             */
            actualUserId: string;
            author: components["schemas"]["OutDtoAuthor"];
            /** Format: dateTime */
            expiresAt: string;
            /** Format: int */
            expiresIn: number;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
            tokenType: string;
            /**
             * Format: stringArray
             * @description If the value is set, user has 2FA enabled. Valid values are:
             *     TOTP - a time-based one-time password second factor
             *     U2F - a standard key-based second factor
             *
             *     Note:
             *     FIDO2 (Passkey) is not a second factor, it fully replaces passwords and need for 2FA.
             *     "twoFAVerified" will be automatically set to true if the user logged in using a Passkey.
             */
            twoFAMethods?: string[] | null;
            /**
             * @description If the value is false, user has 2FA enabled, and the login wasn't verified yet.
             * @default false
             */
            twoFAVerified: boolean | null;
            /**
             * Format: UUIDShort
             * @description For regular authentication, this is the userId of the user. For integration tokens, this is the userId of the token itself.
             */
            userId: string;
        };
        ResponseAuthFull: {
            accessToken: string;
            /**
             * Format: UUIDShort
             * @description Underlying userId regardless of the authentication method. For regular authentication, this is the same as userId. For integration tokens, this is the userId of the token owner.
             */
            actualUserId: string;
            author: components["schemas"]["OutDtoAuthor"];
            /** Format: dateTime */
            expiresAt: string;
            /** Format: int */
            expiresIn: number;
            /** @description Application tokens do not have refresh tokens, only standard login tokens have them. */
            refreshToken?: string | null;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
            tokenType: string;
            /**
             * Format: stringArray
             * @description If the value is set, user has 2FA enabled. Valid values are:
             *     TOTP - a time-based one-time password second factor
             *     U2F - a standard key-based second factor
             *
             *     Note:
             *     FIDO2 (Passkey) is not a second factor, it fully replaces passwords and need for 2FA.
             *     "twoFAVerified" will be automatically set to true if the user logged in using a Passkey.
             */
            twoFAMethods?: string[] | null;
            /**
             * @description If the value is false, user has 2FA enabled, and the login wasn't verified yet.
             * @default false
             */
            twoFAVerified: boolean | null;
            /**
             * Format: UUIDShort
             * @description For regular authentication, this is the userId of the user. For integration tokens, this is the userId of the token itself.
             */
            userId: string;
        };
        ResponseAuthLogin: {
            auth: components["schemas"]["OutDtoAuthFull"];
            /** @description If user has 2FA enabled, this field will be null until user has passed 2FA verification. */
            user?: components["schemas"]["OutDtoUser"];
        };
        ResponseAuthRegistration: {
            auth: components["schemas"]["OutDtoAuthFull"];
            /** @description If user has 2FA enabled, this field will be null until user has passed 2FA verification. */
            user?: components["schemas"]["OutDtoUser"];
            /** @description If user chose passkey, necessary challenge data will be in this field. Otherwise, it will be null. */
            webAuthn?: components["schemas"]["OutDtoWebAuthnOptions"];
        };
        ResponseAvailableAddons: {
            /** Format: objectArray */
            clientAddons: components["schemas"]["OutDtoAddon"][];
            /** Format: objectArray */
            projectAddons: components["schemas"]["OutDtoAddon"][];
        };
        ResponseCardPayment: {
            /**
             * Format: decimal
             * @description Amount without VAT
             */
            amount: string;
            /**
             * Format: decimal
             * @description Amount that contains a VAT tax
             */
            amountVat: string;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: id */
            currencyId: string;
            /** Format: dateTime */
            datePaid?: string | null;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description OFFSESSION musí obsahovat i requestId.
             * @default ONSESSION
             * @enum {string}
             */
            interactionType: "ONSESSION" | "OFFSESSION";
            /** Format: UUIDShort */
            invoiceId?: string | null;
            /** Format: dateTime */
            lastUpdate: string;
            /** @description Stripe source_id - zdroj, odkud se mají prostředky strhnout. */
            paymentMethod?: string | null;
            /** @description Id requestu, který payment vyvolal - offsession platby. */
            requestId?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "PROCESSING" | "PROCESSING_FAILED" | "PAYMENT_DECLINED" | "PAYMENT_DECLINE_FAILED" | "PAYMENT_SUCCESS" | "BALANCE_UPDATED" | "BALANCE_UPDATE_FAILED" | "INVOICED" | "INVOICING_FAILED" | "FINISHED" | "CANCELED" | "DECLINED";
            /** Format: UUIDShort */
            userId?: string | null;
        };
        ResponseCardPaymentList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoCardPayment"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseClient: {
            accountName: string;
            avatar?: components["schemas"]["BaseClientAvatar"];
            billingInfo?: components["schemas"]["OutDtoBillingInfo"];
            /** Format: UUIDShort */
            id: string;
            paymentProviderClientId?: string | null;
            verifiedByTopUp: boolean;
            verifiedManually: boolean;
        };
        ResponseClientIntegrationToken: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: dateTime */
            created: string;
            /**
             * Format: UUIDShort
             * @description User that invited this user, if any. In case of integration tokens, this is the token creator.
             */
            createdByUser?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            name: string;
            /** Format: objectArray */
            projects: components["schemas"]["OutDtoClientIntegrationTokenProjectAccess"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
        };
        ResponseClientIntegrationTokenDelegation: {
            /**
             * Format: UUIDShort
             * @description ID of the client to which the token will be bound
             */
            clientId: string;
            /**
             * Format: UUIDShort
             * @description ID of the user granting the permission
             */
            clientUserId: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /**
             * Format: UUIDShort
             * @description ID of the integration token, to which the permission was granted
             */
            tokenId: string;
            tokenPermissions: components["schemas"]["BaseIntegrationTokenDelegationPermission"];
            /**
             * Format: UUIDShort
             * @description ID of the user granting the permission
             */
            userId: string;
        };
        ResponseClientIntegrationTokenDelegationList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoClientIntegrationTokenDelegation"][];
        };
        ResponseClientIntegrationTokenList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoClientIntegrationToken"][];
        };
        ResponseClientIntegrationTokenRaw: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: dateTime */
            created: string;
            /**
             * Format: UUIDShort
             * @description User that invited this user, if any. In case of integration tokens, this is the token creator.
             */
            createdByUser?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            name: string;
            /** Format: objectArray */
            projects: components["schemas"]["OutDtoClientIntegrationTokenProjectAccess"][];
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
            token: string;
        };
        ResponseClientPromoCodeRedemption: {
            /** Format: decimal */
            bonusCreditAmount: string;
            code: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: UUIDShort */
            promoCodeId: string;
        };
        ResponseClientPromoCodeRedemptionList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoClientPromoCodeRedemption"][];
            /** Format: int */
            totalCount: number;
        };
        ResponseClientSecret: {
            clientSecret: string;
        };
        ResponseClientStatus: {
            autoTopUp?: components["schemas"]["OutDtoAutoTopUp"];
            clientInfo: components["schemas"]["OutDtoClientInfoObject"];
            /** Format: float */
            credit: number;
            /** Format: float */
            promoCredit: number;
        };
        ResponseClientUserExtra: {
            /**
             * @description Only Owner and Admin can set/modify this flag, and it cannot be disabled for these roles.
             *     When enabled, the user can create new projects and will automatically receive the Owner role for those projects.
             * @default false
             */
            canCreateProjects: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view and modify financial information for the client. Enabling this flag also enables canViewFinances.
             * @default false
             */
            canEditFinances: boolean;
            /**
             * @description Only Owner can set/modify this flag, and it cannot be disabled for this role.
             *     When enabled, the user can view financial information for the client.
             * @default false
             */
            canViewFinances: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Assigned user role.
             *
             *     Roles are tiered, and the higher role has all the permissions of the lower role.
             *     Order of roles, from highest to lowest: Owner > Admin > Basic user > Read only > No access.
             *
             *     - Owner: Full control over company settings, billing, personnel, and all technical resources. Always has CanCreateProjects, CanViewFinances, and CanEditFinances enabled (cannot be disabled).
             *     - Admin: Full control over projects and technical resources, but cannot manage billing or Owner/Admin personnel. Always has CanCreateProjects enabled (cannot be disabled).
             *     - Basic user: Can perform standard operations on projects.
             *     - Read only: Can view project configurations and logs but cannot modify anything.
             *     - No access: Cannot access any resources by default.
             *
             *     Project-specific roles override client-level roles. Users with CanCreateProjects enabled can create new projects and automatically receive the Owner role for those projects.
             * @default NO_ACCESS
             * @enum {string}
             */
            roleCode: "OWNER" | "ADMIN" | "BASIC_USER" | "READ_ONLY" | "NO_ACCESS";
            /** @enum {string} */
            status: "WAITING_AUTHORIZATION" | "ACTIVE";
            user: components["schemas"]["OutDtoUserLight"];
            /** Format: UUIDShort */
            userId: string;
        };
        ResponseClientUserExtraWithClientLightList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoClientUserExtraWithClientLight"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseClientUserList: {
            /** Format: objectArray */
            clientUserList: components["schemas"]["OutDtoClientUserExtra"][];
        };
        ResponseClientUserProjectRoleList: {
            /** Format: objectArray */
            projectRoleList: components["schemas"]["OutDtoClientUserProjectRole"][];
        };
        ResponseClientUserValidate: {
            /** Format: email */
            email: string;
            /** Format: UUIDShort */
            id: string;
        };
        ResponseContainerList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoContainer"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseDeletePublicHttpRouting: {
            deleted: boolean;
            publicHttpRouting?: components["schemas"]["OutDtoPublicHttpRouting"];
        };
        ResponseDeletePublicPortRouting: {
            deleted: boolean;
            publicPortRouting?: components["schemas"]["OutDtoPublicPortRouting"];
        };
        ResponseDeviceLoginCheck: {
            /** @description Set only when the status is APPROVED and the kind is LOGIN. The request is deleted afterwards. */
            auth?: components["schemas"]["OutDtoAuthLogin"];
            /**
             * @default PENDING
             * @enum {string}
             */
            status: "PENDING" | "APPROVED" | "DENIED";
        };
        ResponseDeviceLoginInfo: {
            /** @description Name shown to the user on the consent page and in the e-mail. */
            appName: string;
            /**
             * @description CONFIDENTIAL apps are verified by their secret. A PUBLIC app's name is not verified.
             * @default PUBLIC
             * @enum {string}
             */
            appType: "PUBLIC" | "CONFIDENTIAL";
            /**
             * Format: text
             * @description Set only for CONFIDENTIAL apps. After a decision, the consent page redirects to the redirectUrl from the approval or denial.
             */
            callbackUrl?: string | null;
            /**
             * Format: int
             * @description Seconds until the request expires.
             */
            expiresIn: number;
            /** @description Set only for PUBLIC apps. */
            initiatorIp?: string | null;
            /** @description Whether the request was initiated from the same IP as the user viewing it. Always true for CONFIDENTIAL apps. */
            ipMatches: boolean;
            /**
             * @description A SUDO request puts the initiating session into sudo mode instead of issuing new tokens.
             * @default LOGIN
             * @enum {string}
             */
            kind: "LOGIN" | "SUDO";
            /** Format: UUIDShort */
            requestId: string;
            /**
             * @default PENDING
             * @enum {string}
             */
            status: "PENDING" | "APPROVED" | "DENIED";
            /** @description Short code shown both in the app and on the consent page. */
            userCode: string;
        };
        ResponseDeviceLoginInitiate: {
            /**
             * Format: int
             * @description Seconds until the request expires.
             */
            expiresIn: number;
            /**
             * Format: int
             * @description Seconds the app waits between two checks.
             */
            interval: number;
            /** @description Returned only to the initiating app, required to collect the tokens. */
            pollSecret: string;
            /** Format: UUIDShort */
            requestId: string;
            /** @description Short code shown both in the app and on the consent page. */
            userCode: string;
            /** @description Consent page the app opens in the browser. */
            verificationUrl: string;
        };
        ResponseDeviceLoginRedirect: {
            /**
             * Format: text
             * @description Set only for CONFIDENTIAL apps, the consent page redirects here.
             *     It is the callback URL with the requestId and either the one-time code or error=access_denied.
             */
            redirectUrl?: string | null;
        };
        ResponseEnvFile: {
            envFile: string;
        };
        ResponseExternalRepositoryIntegration: {
            githubIntegration?: components["schemas"]["OutDtoGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoGitlabIntegration"];
        };
        ResponseFileBrowsing: {
            /** Format: UUIDShort */
            accessToken: string;
            /** Format: dateTime */
            expiration: string;
            listUrl: string;
            readFileContentUrl: string;
            readFileUrl: string;
        };
        ResponseFileDownload: Record<string, never>;
        ResponseFirstClassRecipe: {
            /** Format: objectArray */
            processes: components["schemas"]["OutDtoProcess"][];
            /** Format: UUIDShort */
            projectId: string;
            projectName: string;
        };
        ResponseGetAppVersion: {
            /** Format: dateTime */
            activationDate?: string | null;
            build?: components["schemas"]["BaseAppVersionBuild"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            createdByUser?: components["schemas"]["BaseUserJsonObject"];
            githubIntegration?: components["schemas"]["OutDtoAppVersionGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoAppVersionGitlabIntegration"];
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            publicGitSource?: components["schemas"]["BaseAppVersionPublicGitSource"];
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /**
             * @default CLI
             * @enum {string}
             */
            source: "CLI" | "GUI" | "GITHUB" | "GITLAB" | "GIT" | "NONE";
            /**
             * @default UPLOADING
             * @enum {string}
             */
            status: "UPLOADING" | "WAITING_TO_DEPLOY" | "DEPLOYING" | "DEPLOY_FAILED" | "ACTIVE" | "BACKUP" | "BUILDING" | "WAITING_TO_BUILD" | "BUILD_FAILED" | "PREPARING_RUNTIME" | "PREPARING_RUNTIME_FAILED" | "BUILD_VALIDATION_FAILED" | "CANCELLED";
            /** Format: objectArray */
            userDataList: components["schemas"]["BaseAppVersionUserData"][];
        };
        ResponseGetBilling: {
            current?: components["schemas"]["OutDtoBillingInfo"];
        };
        ResponseGetProjectsByName: {
            /** Format: objectArray */
            projects: components["schemas"]["OutDtoProject"][];
        };
        ResponseGetRecipeData: {
            content: string;
            /** Format: objectArray */
            environments: components["schemas"]["OutDtoGetRecipeEnvironment"][];
            /** Format: stringArray */
            errors?: string[] | null;
            /** Format: map */
            extracts: Record<string, never>;
            name: string;
        };
        ResponseGithubAuth: {
            githubUrl: string;
        };
        ResponseGitlabAuth: {
            gitlabUrl: string;
        };
        ResponseInvoice: {
            /** Format: float */
            amount: number;
            /** Format: float */
            amountVat: number;
            /** Format: float */
            amountVatCzk: number;
            /** Format: jsonRawMessage */
            billingInfo?: Record<string, never> | null;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: id */
            currencyId: string;
            /** Format: float */
            currencyRateCzk: number;
            /** Format: dateTime */
            dueDate: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            number: string;
            /** Format: dateTime */
            paidDate?: string | null;
            /** Format: UUIDShort */
            paymentId?: string | null;
            refundedBy?: string | null;
            /** Format: jsonRawMessage */
            supplier: Record<string, never>;
            /** Format: float */
            total: number;
            /** @enum {string} */
            type: "INVOICE" | "RECEIPT" | "CREDIT_NOTE";
            /** Format: float */
            vatRate: number;
        };
        ResponseNginxConfig: {
            /** Format: text */
            defaultSite: string;
        };
        ResponsePaymentSources: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: objectArray */
            sources: components["schemas"]["OutDtoPaymentSource"][];
        };
        ResponsePostAppVersion: {
            build?: components["schemas"]["BaseAppVersionBuild"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            /**
             * @default UPLOADING
             * @enum {string}
             */
            status: "UPLOADING" | "WAITING_TO_DEPLOY" | "DEPLOYING" | "DEPLOY_FAILED" | "ACTIVE" | "BACKUP" | "BUILDING" | "WAITING_TO_BUILD" | "BUILD_FAILED" | "PREPARING_RUNTIME" | "PREPARING_RUNTIME_FAILED" | "BUILD_VALIDATION_FAILED" | "CANCELLED";
            uploadUrl: string;
            /** Format: objectArray */
            userDataList: components["schemas"]["BaseAppVersionUserData"][];
        };
        ResponsePostBilling: {
            clientSecret: string;
            paymentId: string;
            paymentStatus: string;
        };
        ResponseProcess: {
            actionName: string;
            appVersion?: components["schemas"]["BaseAppVersionJsonObject"];
            canceledByUser?: components["schemas"]["BaseUserJsonObject"];
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            createdBySystem: boolean;
            createdByUser: components["schemas"]["BaseUserJsonObject"];
            error?: components["schemas"]["BaseErrorObject"];
            /** Format: dateTime */
            finished?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            project?: components["schemas"]["BaseProjectLightJsonObject"];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: map */
            publicMeta?: Record<string, never> | null;
            /** Format: int */
            sequence: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /** Format: objectArray */
            serviceStacks: components["schemas"]["BaseServiceStackLightJsonObject"][];
            /** Format: dateTime */
            started?: string | null;
            /** @default PENDING */
            status: string;
        };
        ResponseProcessList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoProcess"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseProcessNil: {
            process?: components["schemas"]["OutDtoProcess"];
        };
        ResponseProject: {
            autoStartup: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description?: string | null;
            /** Format: UUIDShort */
            id: string;
            /** Format: dateTime */
            lastUpdate: string;
            logForwardingType?: string | null;
            /**
             * @default LEGACY
             * @enum {string}
             */
            mode: "LIGHT" | "SERIOUS";
            name: string;
            primaryInstanceLocation: components["schemas"]["OutDtoLocation"];
            publicIpV4?: string | null;
            /** @default false */
            publicIpV4Shared: boolean;
            publicIpV6?: string | null;
            publicZone: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "DELETING" | "FAILED" | "STOPPING" | "STOPPED" | "STARTING";
            /** Format: stringArray */
            tagList: string[];
            /** Format: objectArray */
            userRoles: components["schemas"]["OutDtoProjectUserRole"][];
            zeropsSubdomainHost?: string | null;
        };
        ResponseProjectBackupList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoProjectBackup"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseProjectEnv: {
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /** Format: dateTime */
            created: string;
            /** @default true */
            editable: boolean;
            /** Format: UUIDShort */
            id: string;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            /** @default false */
            sensitive: boolean;
            /**
             * @default USER
             * @enum {string}
             */
            type: "USER" | "SYSTEM";
        };
        ResponseProjectEnvList: {
            /** Format: objectArray */
            items: components["schemas"]["OutDtoProjectEnv"][];
        };
        ResponseProjectEnvReveal: {
            content: string;
        };
        ResponseProjectExport: {
            /** Format: text */
            yaml: string;
        };
        ResponseProjectImport: {
            /** Format: UUIDShort */
            projectId: string;
            projectName: string;
            /** Format: objectArray */
            serviceStacks: components["schemas"]["OutDtoProjectImportServiceStack"][];
        };
        ResponseProjectL7httpbalancerConfig: {
            /** Format: objectArray */
            values: components["schemas"]["OutDtoProjectL7httpbalancerConfigValue"][];
        };
        ResponseProjectList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoProject"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseProjectLog: {
            /** Format: UUIDShort */
            accessToken: string;
            /** Format: dateTime */
            expiration: string;
            url: string;
            urlInfo: string;
            urlPlain: string;
            urlUi: string;
        };
        ResponseProjectVpnItem: {
            peer: components["schemas"]["OutDtoProjectVpnPeerSetup"];
            project: components["schemas"]["OutDtoProjectVpnSetup"];
        };
        ResponseProjectVpnList: {
            /** Format: objectArray */
            peers: components["schemas"]["OutDtoProjectVpnPeerSetup"][];
            project: components["schemas"]["OutDtoProjectVpnSetup"];
        };
        ResponsePromoCodeFlow: {
            /** @enum {string} */
            flow: "TOP_UP" | "VERIFIED" | "STANDALONE";
        };
        ResponsePublicHttpRouting: {
            /** @default false */
            cdnEnabled: boolean;
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            deleteOnSync: boolean;
            /** Format: objectArray */
            domains: components["schemas"]["BasePublicHttpRoutingDomain"][];
            /** Format: UUIDShort */
            id: string;
            isEditable: boolean;
            isSynced: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: objectArray */
            locations: components["schemas"]["BasePublicHttpRoutingLocation"][];
            /** Format: UUIDShort */
            projectId: string;
            sslEnabled: boolean;
        };
        ResponsePublicHttpRoutingList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoPublicHttpRouting"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponsePublicPortRouting: {
            /** Format: UUIDShort */
            clientId: string;
            /** Format: dateTime */
            created: string;
            deleteOnSync: boolean;
            firewallAllowMyIp: boolean;
            /** Format: stringArray */
            firewallIpRanges: string[];
            /**
             * @default BLACKLIST
             * @enum {string}
             */
            firewallPolicy: "BLACKLIST" | "WHITELIST";
            /** Format: UUIDShort */
            id: string;
            /** Format: int */
            internalPort: number;
            /**
             * @default tcp
             * @enum {string}
             */
            internalProtocol: "tcp" | "udp";
            isSynced: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            /**
             * @default IP_V4
             * @enum {string}
             */
            publicIpType: "IP_V4" | "IP_V6";
            /** Format: int */
            publicPort: number;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
        };
        ResponsePublicPortRoutingList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoPublicPortRouting"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseRegionList: {
            /** Format: objectArray */
            items: components["schemas"]["OutDtoRegion"][];
        };
        ResponseServiceList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoService"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseServiceStack: {
            activeAppVersion?: components["schemas"]["OutDtoGetAppVersion"];
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: map
             * @description List of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            base: string;
            buildCache?: components["schemas"]["OutDtoBuildCache"];
            /** @default false */
            cdnEnabled: boolean;
            coreService?: components["schemas"]["OutDtoServiceStackLight"];
            /** Format: dateTime */
            created: string;
            currentAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customPortsEnabled: boolean;
            githubIntegration?: components["schemas"]["OutDtoGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoGitlabIntegration"];
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            isSystem: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** @deprecated */
            mode?: string | null;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: id */
            nestId: string;
            /** Format: objectArray */
            ports: components["schemas"]["BaseServicePort"][];
            project: components["schemas"]["OutDtoProjectLight"];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            reloadAvailable: boolean;
            requestedPorts: components["schemas"]["BaseRequestedPortsJsonObject"];
            /** Format: id */
            serviceStackTypeId: string;
            serviceStackTypeInfo: components["schemas"]["BaseServiceStackInfoJsonObject"];
            /**
             * Format: id
             * @deprecated
             * @description Deprecated. Replaced by `base` field
             */
            serviceStackTypeVersionId: string;
            startOnProjectStart: boolean;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "DELETING" | "DELETED" | "FAILED" | "ACTION_FAILED" | "UPGRADING" | "READY_TO_DEPLOY" | "SERVICE_CREATING" | "SERVICE_ACTIVE" | "SERVICE_STOPPING" | "SERVICE_STOPPED" | "SERVICE_STARTING" | "SERVICE_RESTARTING" | "SERVICE_RELOADING" | "SERVICE_DELETING" | "SERVICE_DELETED" | "SERVICE_FAILED" | "SERVICE_ACTION_FAILED" | "SERVICE_REPAIRING" | "SERVICE_CONTAINER_FAILED" | "SERVICE_MOVING_CONTAINER" | "SERVICE_UPGRADING" | "SERVICE_SCALING" | "SERVICE_REPAIR_FAILED" | "REPAIRING" | "CONTAINER_FAILED" | "MOVING_CONTAINER" | "SCALING" | "REPAIR_FAILED";
            subdomainAccess: boolean;
            /** Format: objectArray */
            userData: components["schemas"]["OutDtoUserData"][];
            /** Format: emptyString */
            versionNumber: string;
        };
        ResponseServiceStackBackup: {
            /** @description Indicates that backup took longer than 10 seconds and is running asynchronously in the background. */
            async: boolean;
            /** @description Indicates that Backup was successfully triggered and is finished or running in background, depending on value in `async`. */
            success: boolean;
        };
        ResponseServiceStackBackupFileList: {
            backupPeriod: string;
            defaultRetentionPolicy: components["schemas"]["OutDtoBackupRetentionPolicy"];
            /** Format: objectArray */
            files: components["schemas"]["OutDtoServiceStackBackupFile"][];
            retentionPolicy?: components["schemas"]["OutDtoBackupRetentionPolicy"];
        };
        ResponseServiceStackDebug: {
            /** @enum {string} */
            debugBuild: "NONE" | "BEFORE" | "ON_FAIL" | "AFTER";
            /** @enum {string} */
            debugRuntimePrepare: "NONE" | "BEFORE" | "ON_FAIL" | "AFTER";
        };
        ResponseServiceStackDiskGBytesUsed: {
            /** Format: float */
            diskGBytesUsed: number;
            /** Format: int64 */
            objects: number;
            /** Format: text */
            rawPolicy: string;
        };
        ResponseServiceStackEnvList: {
            /** Format: objectArray */
            items: components["schemas"]["OutDtoServiceStackEnv"][];
        };
        ResponseServiceStackList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoServiceStack"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseServiceStackProcess: {
            activeAppVersion?: components["schemas"]["OutDtoGetAppVersion"];
            /** @example oltp-production */
            autoscalingProfileId?: string | null;
            /**
             * Format: map
             * @description List of overrides for the selected autoscaling profile
             * @example {
             *       "max_worker_processes": 10,
             *       "shared_buffers": 1342177280,
             *       "wal_compression": "zstd"
             *     }
             */
            autoscalingProfileOverrides?: Record<string, never> | null;
            /**
             * @description Full identifier of the service stack version. Format `os/software@version` or `software:mode@version`
             * @example ubuntu/bun@1.4
             */
            base: string;
            buildCache?: components["schemas"]["OutDtoBuildCache"];
            /** @default false */
            cdnEnabled: boolean;
            coreService?: components["schemas"]["OutDtoServiceStackLight"];
            /** Format: dateTime */
            created: string;
            currentAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customAutoscaling?: components["schemas"]["OutDtoCustomAutoscaling"];
            customPortsEnabled: boolean;
            githubIntegration?: components["schemas"]["OutDtoGithubIntegration"];
            gitlabIntegration?: components["schemas"]["OutDtoGitlabIntegration"];
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            id: string;
            isSystem: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** @deprecated */
            mode?: string | null;
            /**
             * @description hostname + ENV
             *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
             *     		check valid hostname
             *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
             *     			: EXCEPTION 400;
             *     			stop;
             *     		endif;
             * @example server1
             */
            name: string;
            /** Format: id */
            nestId: string;
            /** Format: objectArray */
            ports: components["schemas"]["BaseServicePort"][];
            process: components["schemas"]["OutDtoProcess"];
            project: components["schemas"]["OutDtoProjectLight"];
            /** Format: UUIDShort */
            projectId: string;
            /** Format: text */
            recipeSource?: string | null;
            /** Format: text */
            recipeSourceUrl?: string | null;
            reloadAvailable: boolean;
            requestedPorts: components["schemas"]["BaseRequestedPortsJsonObject"];
            /** Format: id */
            serviceStackTypeId: string;
            serviceStackTypeInfo: components["schemas"]["BaseServiceStackInfoJsonObject"];
            /**
             * Format: id
             * @deprecated
             * @description Deprecated. Replaced by `base` field
             */
            serviceStackTypeVersionId: string;
            startOnProjectStart: boolean;
            /**
             * @default NEW
             * @enum {string}
             */
            status: "NEW" | "CREATING" | "ACTIVE" | "STOPPING" | "STOPPED" | "STARTING" | "RESTARTING" | "RELOADING" | "DELETING" | "DELETED" | "FAILED" | "ACTION_FAILED" | "UPGRADING" | "READY_TO_DEPLOY" | "SERVICE_CREATING" | "SERVICE_ACTIVE" | "SERVICE_STOPPING" | "SERVICE_STOPPED" | "SERVICE_STARTING" | "SERVICE_RESTARTING" | "SERVICE_RELOADING" | "SERVICE_DELETING" | "SERVICE_DELETED" | "SERVICE_FAILED" | "SERVICE_ACTION_FAILED" | "SERVICE_REPAIRING" | "SERVICE_CONTAINER_FAILED" | "SERVICE_MOVING_CONTAINER" | "SERVICE_UPGRADING" | "SERVICE_SCALING" | "SERVICE_REPAIR_FAILED" | "REPAIRING" | "CONTAINER_FAILED" | "MOVING_CONTAINER" | "SCALING" | "REPAIR_FAILED";
            subdomainAccess: boolean;
            /** Format: objectArray */
            userData: components["schemas"]["OutDtoUserData"][];
            /** Format: emptyString */
            versionNumber: string;
        };
        ResponseServiceStackTypeDetail: {
            /**
             * @default CORE
             * @enum {string}
             */
            category: "CORE" | "HTTP_L7_BALANCER" | "STANDARD" | "USER" | "LOCAL_STORAGE" | "OBJECT_STORAGE" | "BUILD" | "INTERNAL" | "PREPARE_RUNTIME";
            /** Format: dateTime */
            created: string;
            /** Format: text */
            description: string;
            docsUrl: string;
            hasAccessDetails: boolean;
            hasBackup: boolean;
            hasConfiguration: boolean;
            hasUiAccess: boolean;
            /** Format: id */
            id: string;
            isBuild: boolean;
            isManaged: boolean;
            isRuntime: boolean;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: stringArray */
            modeList: string[];
            name: string;
            /** Format: stringArray */
            osList: string[];
            /** Format: objectArray */
            serviceStackTypeVersionList: components["schemas"]["OutDtoServiceStackTypeVersion"][];
            subcategory: string;
        };
        ResponseServiceStackUi: {
            /** Format: UUIDShort */
            accessToken: string;
            /** Format: dateTime */
            expiration: string;
            urlApi: string;
            urlUi: string;
        };
        ResponseSettings: {
            /** Format: objectArray */
            currencyList: components["schemas"]["OutDtoCurrency"][];
            /** Format: objectArray */
            languageList: components["schemas"]["OutDtoLanguage"][];
            /** Format: objectArray */
            locationList: components["schemas"]["OutDtoLocation"][];
            /** Format: objectArray */
            serviceStackList: components["schemas"]["OutDtoServiceStackType"][];
        };
        ResponseSettingsCountryList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoCountry"][];
        };
        ResponseSuccess: {
            success: boolean;
        };
        ResponseSudoMode: {
            /** @description Whether user is in sudo mode. */
            inSudo: boolean;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
        };
        ResponseTagList: {
            /** Format: stringArray */
            items: string[];
        };
        ResponseTotpRegistration: {
            /** @description Raw TOTP code for manual entry if QR code is not supported by the client. */
            code: string;
            /** @description QR code PNG image (200x200px) data in base64 format. */
            qrcode: string;
            /**
             * Format: UUIDShort
             * @description Session ID for use in /2fa/totp/registration/finish endpoint.
             */
            sessionId: string;
        };
        ResponseTwoFAAuth: {
            accessToken: string;
            /**
             * Format: UUIDShort
             * @description Underlying userId regardless of the authentication method. For regular authentication, this is the same as userId. For integration tokens, this is the userId of the token owner.
             */
            actualUserId: string;
            author: components["schemas"]["OutDtoAuthor"];
            /** Format: dateTime */
            expiresAt: string;
            /** Format: int */
            expiresIn: number;
            /** @description If user has used a recovery token for 2FA, this field will contain a replacement recovery token. */
            newRecoveryToken?: string | null;
            /**
             * Format: dateTime
             * @description Sudo mode is a temporary mode, required for certain sensitive operations.
             *     Sudo mode is used even if user doesn't have 2FA enabled, in that case, password is used to authenticate.
             *     If the value is set, the user is in sudo mode until the time set.
             *     If the time is in the past, the user is out of sudo mode and must re-authenticate with any method to re-enable it.
             */
            sudoUntil?: string | null;
            tokenType: string;
            /**
             * Format: stringArray
             * @description If the value is set, user has 2FA enabled. Valid values are:
             *     TOTP - a time-based one-time password second factor
             *     U2F - a standard key-based second factor
             *
             *     Note:
             *     FIDO2 (Passkey) is not a second factor, it fully replaces passwords and need for 2FA.
             *     "twoFAVerified" will be automatically set to true if the user logged in using a Passkey.
             */
            twoFAMethods?: string[] | null;
            /**
             * @description If the value is false, user has 2FA enabled, and the login wasn't verified yet.
             * @default false
             */
            twoFAVerified: boolean | null;
            /**
             * Format: UUIDShort
             * @description For regular authentication, this is the userId of the user. For integration tokens, this is the userId of the token itself.
             */
            userId: string;
        };
        ResponseTwoFAAuthLogin: {
            auth: components["schemas"]["OutDtoAuthFull"];
            /** @description If user has used a recovery token for 2FA, this field will contain a replacement recovery token. */
            newRecoveryToken?: string | null;
            /** @description If user has 2FA enabled, this field will be null until user has passed 2FA verification. */
            user?: components["schemas"]["OutDtoUser"];
        };
        ResponseTwoFARecoveryCodes: {
            /** Format: stringArray */
            codes: string[];
        };
        ResponseUrl: {
            url: string;
        };
        ResponseUser: {
            avatar?: components["schemas"]["BaseUserAvatar"];
            /** Format: objectArray */
            clientUserList: components["schemas"]["OutDtoClientUserExtraWithClientLight"][];
            /** Format: int */
            countryCallingCode?: number | null;
            /** Format: dateTime */
            created: string;
            /** Format: email */
            email: string;
            /** @default false */
            emailVerified: boolean;
            firstName: string;
            fullName: string;
            /** Format: UUIDShort */
            id: string;
            language: components["schemas"]["OutDtoLanguage"];
            /** Format: emptyString */
            lastName: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: int */
            phoneNumber?: number | null;
            /** @enum {string} */
            status: "ACTIVE" | "BANNED";
        };
        ResponseUserAuthorize: {
            avatar?: components["schemas"]["BaseUserAvatar"];
            /** Format: objectArray */
            clientUserList: components["schemas"]["OutDtoClientUserExtraWithClientLight"][];
            /** Format: int */
            countryCallingCode?: number | null;
            /** Format: dateTime */
            created: string;
            /** Format: email */
            email: string;
            /** @default false */
            emailVerified: boolean;
            firstName: string;
            fullName: string;
            hasPasskey: boolean;
            hasU2F: boolean;
            /** Format: UUIDShort */
            id: string;
            intercomHash: string;
            language: components["schemas"]["OutDtoLanguage"];
            /** Format: emptyString */
            lastName: string;
            /** Format: dateTime */
            lastUpdate: string;
            passwordIsSet: boolean;
            /** Format: int */
            phoneNumber?: number | null;
            /** @enum {string} */
            status: "ACTIVE" | "BANNED";
            totpIsSet: boolean;
        };
        ResponseUserConnect: {
            /** Format: email */
            email: string;
            /** Format: UUIDShort */
            id: string;
        };
        ResponseUserData: {
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: text
             * @description maximálně 8192 znaků, pouze ASCII znaky bez CR a LF
             * @example a=1
             */
            content: string;
            /** Format: dateTime */
            created: string;
            /** @default false */
            editable: boolean;
            /** Format: UUIDShort */
            id: string;
            /** @default false */
            internal: boolean;
            /**
             * @description Musí splňovat regulár [a-zA-Z_]+[a-zA-Z0-9_]*
             *     			Jinak stejné požadavky, jako jsou na pole NAME v doménovém záznamu
             *
             *     			if ( domainName NOT ENDS WITH "." ? ) then (yes)
             *     			   : domainName = inputDomainName || ".";
             *     			endif;
             *
             *     			if ( domainRecord.name CONTAINS ".." ? ) then ( yes )
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(domainRecord.name > 255)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             *
             *     			if ( length(BETWEEN "." AND "." domainRecord.name > 63)
             *     			   : EXCEPTION 400;
             *     			   stop;
             *     			endif;
             * @example server1
             */
            key: string;
            /** Format: dateTime */
            lastUpdate: string;
            /** Format: UUIDShort */
            projectId: string;
            sensitive: boolean;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId: string;
            serviceStackName: string;
            /**
             * @description Odfiltrovat záznamy userData.type == INTERNAL na výstupu /search
             * @default USER
             * @enum {string}
             */
            type: "READ_ONLY" | "EDITABLE" | "SECRET" | "INTERNAL" | "ENV" | "USER" | "SYSTEM";
        };
        ResponseUserDataList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoUserData"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseUserDataReveal: {
            content: string;
        };
        ResponseUserNotification: {
            /** Format: dateTime */
            actionCreated: string;
            /** Format: dateTime */
            actionFinished?: string | null;
            actionName: string;
            /** Format: dateTime */
            actionStarted?: string | null;
            appVersion?: components["schemas"]["BaseAppVersionJsonObject"];
            canceledByUser?: components["schemas"]["BaseUserJsonObject"];
            /** Format: UUIDShort */
            clientId: string;
            /**
             * Format: UUIDShort
             * @description =container.Id in zerops infrastructure
             */
            containerId?: string | null;
            /** Format: int */
            containerNumber?: number | null;
            /** Format: dateTime */
            created: string;
            createdByUser: components["schemas"]["BaseUserJsonObject"];
            error?: components["schemas"]["BaseErrorObject"];
            /** @enum {string|null} */
            executorTag?: "MAIN" | "L7_MASTER" | null;
            /** Format: UUIDShort */
            id: string;
            project?: components["schemas"]["BaseProjectLightJsonObject"];
            /** Format: UUIDShort */
            projectId?: string | null;
            serviceName?: string | null;
            /**
             * Format: UUIDShort
             * @description = stack.id in Zerops Infrastructure
             */
            serviceStackId?: string | null;
            /** Format: objectArray */
            serviceStacks: components["schemas"]["BaseServiceStackLightJsonObject"][];
            /**
             * @default SUCCESS
             * @enum {string}
             */
            type: "SUCCESS" | "WARNING" | "ERROR";
        };
        ResponseUserNotificationList: {
            /** Format: int */
            count: number;
            /** Format: int */
            limit: number;
            /** Format: objectArray */
            list: components["schemas"]["OutDtoUserNotification"][];
            /** Format: int */
            offset: number;
            /** Format: int */
            total: number;
        };
        ResponseUserToken: {
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** @description User defined token name */
            name: string;
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
        };
        ResponseUserTokenList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoUserToken"][];
        };
        ResponseUserTokenRaw: {
            /** Format: dateTime */
            created: string;
            /** Format: UUIDShort */
            id: string;
            /** @description User defined token name */
            name: string;
            /**
             * @description When enabled, the token is in sudo mode for as long as it exists.
             * @default false
             */
            sudo: boolean;
            /** @description Token value hashed with sha512 */
            token: string;
        };
        ResponseVCSRepositoryBranchList: {
            /** Format: objectArray */
            branches: components["schemas"]["OutDtoVCSRepositoryBranch"][];
        };
        ResponseVCSRepositoryList: {
            /** Format: objectArray */
            repositories: components["schemas"]["OutDtoVCSRepository"][];
        };
        ResponseWebAuthnCredentialList: {
            /** Format: objectArray */
            list: components["schemas"]["OutDtoWebAuthnCredential"][];
        };
        ResponseWebAuthnOptions: {
            /** Format: jsonRawMessage */
            response: Record<string, never>;
            /** Format: UUIDShort */
            sessionId: string;
        };
        ResponseWebAuthnRegistrationVerification: {
            auth: components["schemas"]["OutDtoAuth"];
            credential: components["schemas"]["OutDtoWebAuthnCredential"];
        };
        ResponseZcliVersion: {
            /** Format: objectArray */
            assets: components["schemas"]["OutDtoZcliVersionAsset"][];
            assets_url: string;
            author: components["schemas"]["OutDtoZcliVersionAuthor"];
            body: string;
            /** Format: dateTime */
            created_at: string;
            draft: boolean;
            html_url: string;
            /** Format: int */
            id: number;
            name: string;
            node_id: string;
            prerelease: boolean;
            /** Format: dateTime */
            published_at: string;
            tag_name: string;
            tarball_url: string;
            target_commitish: string;
            upload_url: string;
            url: string;
            zipball_url: string;
        };
    };
    responses: never;
    parameters: {
        Sync: boolean | null;
        XGitHubEvent: string;
        XGitlabEvent: string;
        XGitlabToken: string;
        XHubSignature: string;
        action: string;
        actionNameContains: string | null;
        base64PublicKey: string;
        branch: string;
        clientId: string;
        code: string;
        date: string;
        delegationId: string;
        domain: string;
        email: string | null;
        /** @description If user has any existing application tokens, delete will fail. Setting force to true will delete these tokens as well. */
        force: boolean;
        haRecipe: string | null;
        /** @description Filters app versions by whether they were produced by a build (build.serviceStackId is set). */
        hasBuild: boolean | null;
        id: string;
        instanceId: string | null;
        invalidate: string | null;
        isSystem: boolean | null;
        keyContains: string | null;
        limit: number | null;
        name: string;
        nameContains: string | null;
        nonHaRecipe: string | null;
        offset: number | null;
        /** @description Replaces the project-level envIsolation for this preview. Accepts the same values as envIsolation. An empty value or no keeps the stored setting. */
        overrideEnvIsolation: string;
        path: string;
        preview: boolean | null;
        projectId: string;
        redirectUrl: string;
        repositoryFullName: string;
        requestId: string;
        reveal: boolean;
        sensitive: boolean;
        serviceStackId: string | null;
        /** @description Deprecated. Replaced by `base` field */
        serviceStackTypeVersionId: string;
        /** @description Fields to sort by: created, sequence. Prefix a field with '-' for descending order. */
        sort: string[] | null;
        stackTypeId: string;
        statuses: string[] | null;
        token: string;
        tokenId: string;
        types: string[] | null;
        url: string;
        userOnly: boolean;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    delete2FACredential: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuth"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    list2FACredentials: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseWebAuthnCredentialList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    "2FAFido2LoginCeremonyFinish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestWebAuthnLoginVerification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    "2FAFido2LoginCeremonyStart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseWebAuthnOptions"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    show2FARecoveryCodes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFARecoveryCodes"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    regenerate2FARecoveryCodes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFARecoveryCodes"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteTOTP2FAAuthenticator: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuth"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    "2FALoginViaTOTP": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestAuthTOTP"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFAAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    totp2FAAuthenticatorRegistrationFinish: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestTotpRegistrationVerification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuth"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    totp2FAAuthenticatorRegistrationStart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTotpRegistration"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetAppVersion"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutAppVersion"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getAppVersionAppCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUrl"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    buildAndDeployAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutAppVersionBuildAndDeploy"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    cancelAppVersionBuild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deployAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutAppVersionDeploy"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    uploadAppVersionArtefact: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/octet-stream": components["schemas"]["RequestFileUpload"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginInitiate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestDeviceLoginInitiate"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginInitiate"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: components["parameters"]["requestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginInfo"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginApprove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: components["parameters"]["requestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginRedirect"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginDeny: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: components["parameters"]["requestId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginRedirect"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestDeviceLoginCheck"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginCheck"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deviceLoginSudoInitiate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestDeviceLoginInitiate"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeviceLoginInitiate"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetAuthUserInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuth"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    userLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    userLogout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
        };
    };
    refreshToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestAuthRefresh"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthFull"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getUserSudoMode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSudoMode"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    enableUserSudoMode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestAuthSudoVerification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFAAuth"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    uploadUserAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteUserAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateBillingAddon: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                clientId: components["parameters"]["clientId"];
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutBillingAddon"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateClientAutochargeOptions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutBillingClientAutocharge"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientAvailableAddons: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAvailableAddons"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    exportClientCredit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostBillingCreditExport"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createPayment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostBillingPayment"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePostBilling"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientPaymentSources: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePaymentSources"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createClientPaymentSource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientSecret"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteClientPaymentSource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestDeleteBillingClientPaymentSource"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientPromoCodeRedemptions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientPromoCodeRedemptionList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    redeemPromoCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPromoCodeRedeem"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientPromoCodeRedemption"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientStatus"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetCardPayment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseCardPayment"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getCardPaymentInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseInvoice"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getCardPaymentInvoicePdf: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUrl"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    downloadInvoicePdfFile: {
        parameters: {
            query?: {
                preview?: components["parameters"]["preview"];
            };
            header?: never;
            path: {
                token: components["parameters"]["token"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    processStripeWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestStripeWebhook"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
        };
    };
    createClient: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostClient"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClient"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserExtra"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateClientUserConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientUserConnection"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserExtra"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteClientUserConnection: {
        parameters: {
            query?: {
                /** @description If user has any existing application tokens, delete will fail. Setting force to true will delete these tokens as well. */
                force?: components["parameters"]["force"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listUserProjectRoles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserProjectRoleList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateUserProjectRoles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientUserProjectRoleList"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserProjectRoleList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClient: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClient"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteClient: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateClientAccountInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutClientAccountInfo"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateClientAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteClientAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientBillingInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetBilling"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateClientBillingInfo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutClientBillingInfo"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetBilling"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListClientCardPayments: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                /** @description Fields to sort by: created, amount. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseCardPaymentList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    firstClassRecipeElk: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestFirstClassRecipeElk"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFirstClassRecipe"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    firstClassRecipePrometheus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestFirstClassRecipePrometheus"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFirstClassRecipe"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createIntegrationToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientIntegrationToken"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenRaw"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getIntegrationToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationToken"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateIntegrationToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientIntegrationToken"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationToken"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteIntegrationToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listOneTokenIntegrationTokenDelegations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenDelegationList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createIntegrationTokenDelegation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestIntegrationTokenDelegationPermission"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenDelegation"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getIntegrationTokenDelegation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description ID of the integration token, to which the permission was granted */
                tokenId: string;
                delegationId: components["parameters"]["delegationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenDelegation"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    deleteIntegrationTokenDelegation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description ID of the integration token, to which the permission was granted */
                tokenId: string;
                delegationId: components["parameters"]["delegationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    regenerateIntegrationToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                tokenId: components["parameters"]["tokenId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenRaw"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listAllIntegrationTokenDelegations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenDelegationList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listIntegrationTokens: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientIntegrationTokenList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListClientProjects: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                nameContains?: components["parameters"]["nameContains"];
                statuses?: components["parameters"]["statuses"];
                /** @description Fields to sort by: created, name. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostProject"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProject"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ImportProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestProjectImport"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectImport"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectTags: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTagList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetClientProjectsByName: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                name: components["parameters"]["name"];
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetProjectsByName"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetClientSettings: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSettings"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetClientSettingsStackType: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                stackTypeId: components["parameters"]["stackTypeId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackTypeDetail"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createClientUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUser"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserExtra"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListClientUserNotifications: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                projectId?: string | null;
                /** @description = stack.id in Zerops Infrastructure */
                serviceStackId?: string | null;
                types?: components["parameters"]["types"];
                /** @description Fields to sort by: created. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserNotificationList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConnectUserToClient: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientUser"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserConnect"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getClientUserList: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    validateClientUserConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientUserValidate"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserValidate"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGithubAuthUrl: {
        parameters: {
            query: {
                redirectUrl: components["parameters"]["redirectUrl"];
                action: components["parameters"]["action"];
                haRecipe?: components["parameters"]["haRecipe"];
                nonHaRecipe?: components["parameters"]["nonHaRecipe"];
                email?: components["parameters"]["email"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGithubAuth"];
                };
            };
        };
    };
    getGithubRepositories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseVCSRepositoryList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGithubRepositoryBranches: {
        parameters: {
            query: {
                repositoryFullName: components["parameters"]["repositoryFullName"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseVCSRepositoryBranchList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    authorizeSudoModeViaGithub: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGithubAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFAAuth"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGithubSudoUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGithubAuth"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    loginGithubUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGithubAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    registerGithubUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGithubAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    authorizeGithubRepositoryAccess: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGithubAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGitlabAuthUrl: {
        parameters: {
            query: {
                redirectUrl: components["parameters"]["redirectUrl"];
                action: "REGISTRATION" | "LOGIN" | "REPOSITORY";
                haRecipe?: components["parameters"]["haRecipe"];
                nonHaRecipe?: components["parameters"]["nonHaRecipe"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGitlabAuth"];
                };
            };
        };
    };
    getGitlabRepositories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseVCSRepositoryList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGitlabRepositoryBranches: {
        parameters: {
            query: {
                repositoryFullName: components["parameters"]["repositoryFullName"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseVCSRepositoryBranchList"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    authorizeSudoModeViaGitlab: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGitlabAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseTwoFAAuth"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getGitlabSudoUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGitlabAuth"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    loginGitlabUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGitlabAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    registerGitlabUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGitlabAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    authorizeGitlabRepositoryAccess: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestGitlabAuth"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProcessDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CancelUserProcess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectEnv: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectEnv"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateProjectEnv: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestProjectEnvPut"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteProjectEnv: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectEnvSensitiveValue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectEnvReveal"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProject"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutProject"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProject"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectBackups: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                serviceStackId?: components["parameters"]["serviceStackId"];
                /** @description Fields to sort by: created, size, serviceStackName. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectBackupList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateProjectBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description = stack.id in Zerops Infrastructure */
                serviceStackId: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostServiceStackBackupModify"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteProjectBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description = stack.id in Zerops Infrastructure */
                serviceStackId: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateProjectBackupDownloadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description = stack.id in Zerops Infrastructure */
                serviceStackId: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUrl"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConfigurePrometheus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestCoreStackPrometheusConfig"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectEnvs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectEnvList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateProjectEnv: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestProjectEnvPost"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectEnvFile: {
        parameters: {
            query: {
                name: string;
                /** @description Replaces the project-level envIsolation for this preview. Accepts the same values as envIsolation. An empty value or no keeps the stored setting. */
                overrideEnvIsolation?: components["parameters"]["overrideEnvIsolation"];
                userOnly?: components["parameters"]["userOnly"];
                reveal?: components["parameters"]["reveal"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseEnvFile"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectEnvFileDownload: {
        parameters: {
            query: {
                name: string;
                /** @description Replaces the project-level envIsolation for this preview. Accepts the same values as envIsolation. An empty value or no keeps the stored setting. */
                overrideEnvIsolation?: components["parameters"]["overrideEnvIsolation"];
                userOnly?: components["parameters"]["userOnly"];
                reveal?: components["parameters"]["reveal"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateProjectEnvFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestProjectEnvPutEnvFile"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ExportProject: {
        parameters: {
            query?: {
                reveal?: components["parameters"]["reveal"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectExport"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    firstClassRecipeDevelopmentContainer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestFirstClassRecipeDevelopmentContainer"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFirstClassRecipe"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectL7httpbalancerConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectL7httpbalancerConfig"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    PutProjectL7httpbalancerConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutProjectL7httpbalancerConfig"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectLog: {
        parameters: {
            query?: {
                instanceId?: components["parameters"]["instanceId"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectLog"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    PutProjectModeUpgrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutProjectModeUpgrade"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectProcesses: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                actionNameContains?: components["parameters"]["actionNameContains"];
                /** @description Fields to sort by: created, actionName. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectEnvFileForEdit: {
        parameters: {
            query?: {
                sensitive?: components["parameters"]["sensitive"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseEnvFile"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectPublicHttpRoutings: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                /** @description Fields to sort by: created. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRoutingList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreatePublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicHttpRoutingPost"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    PutProjectPublicIpV4Shared: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutProjectPublicIpV4Shared"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProject"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConfigureRemoteLogging: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutProjectRemoteLogging"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RequestIpv4: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RevertPublicHttpRoutingChanges: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RevertPublicPortRoutingChanges: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectServiceStacks: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                nameContains?: components["parameters"]["nameContains"];
                isSystem?: components["parameters"]["isSystem"];
                /** @description Fields to sort by: created, name. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostServiceStack"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateStandardServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                /** @description Deprecated. Replaced by `base` field */
                serviceStackTypeVersionId: components["parameters"]["serviceStackTypeVersionId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostStandardServiceStack"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ImportServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestServiceStackImport"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectImport"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateObjectStorageV1: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostObjectStorageServiceStack"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    StartProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    StopProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    SyncPublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    SyncPublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateProjectVpn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostProjectVpn"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectVpnItem"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteProjectVpn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostProjectVpn"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetProjectVpnByKey: {
        parameters: {
            query?: {
                instanceId?: components["parameters"]["instanceId"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
                base64PublicKey: components["parameters"]["base64PublicKey"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectVpnItem"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListProjectVpn: {
        parameters: {
            query?: {
                instanceId?: components["parameters"]["instanceId"];
            };
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectVpnList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    getPromoCodeFlow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                code: components["parameters"]["code"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePromoCodeFlow"];
                };
            };
        };
    };
    GetPublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdatePublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicHttpRoutingPut"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeletePublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeletePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdatePublicHttpRoutingLocation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicHttpRoutingLocationPut"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RestorePublicHttpRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicHttpRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    TriggerPublicHttpRoutingDomainsDnsCheck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicHttpRoutingPutTriggerDomainDnsCheck"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetPublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicPortRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdatePublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicPortRouting"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicPortRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeletePublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseDeletePublicPortRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RestorePublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicPortRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    data: {
        parameters: {
            query?: {
                invalidate?: components["parameters"]["invalidate"];
                branch?: components["parameters"]["branch"];
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetRecipeData"];
                };
            };
        };
    };
    info: {
        parameters: {
            query: {
                url: components["parameters"]["url"];
                invalidate?: components["parameters"]["invalidate"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseGetRecipeData"];
                };
            };
        };
    };
    GetRegions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseRegionList"];
                };
            };
        };
    };
    GetZcliRegions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseRegionList"];
                };
            };
        };
    };
    RegisterUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserRegistration"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthRegistration"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetServiceStackByName: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                projectId: components["parameters"]["projectId"];
                /**
                 * @description hostname + ENV
                 *     		Jako hostname + musí splňovat regulární výraz [a-zA-Z_]+[a-zA-Z0-9_]*
                 *     		check valid hostname
                 *     		if ( hostnameENV NOT IN  "[a-zA-Z_]+[a-zA-Z0-9_]*" ? ) then ( yes )
                 *     			: EXCEPTION 400;
                 *     			stop;
                 *     		endif;
                 * @example server1
                 */
                name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStack"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStack"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    listServiceStackAppVersions: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                /** @description Filters app versions by whether they were produced by a build (build.serviceStackId is set). */
                hasBuild?: components["parameters"]["hasBuild"];
                /** @description Fields to sort by: created, sequence. Prefix a field with '-' for descending order. */
                sort?: components["parameters"]["sort"];
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAppVersionList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostAppVersion"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePostAppVersion"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConfigureAutoscaling: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestAutoscaling"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListBackups: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackBackupFileList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    BackupServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostServiceStackBackup"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackBackup"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConfigureBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestServiceStackBackupConfig"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPostServiceStackBackupModify"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateDownloadBackupUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
                date: components["parameters"]["date"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUrl"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteBuildCache: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    EnableStorageCdn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DisableStorageCdn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListServiceStackContainers: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                /** @description Fields to sort by: created, number. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseContainerList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ConfigureDebug: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutServiceStackDebug"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackDebug"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DisableSubdomainAccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    EnableSubdomainAccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetServiceStackEnvList: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackEnvList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ExportServiceStack: {
        parameters: {
            query?: {
                reveal?: components["parameters"]["reveal"];
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProjectExport"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    SetupExternalRepositoryIntegration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestExternalRepositoryIntegration"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetExternalRepositoryIntegrationStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseExternalRepositoryIntegration"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateFileBrowsingAccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileBrowsing"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    HandleGithubWebhook: {
        parameters: {
            query?: never;
            header: {
                "X-Github-Event": components["parameters"]["XGitHubEvent"];
                "X-Hub-Signature": components["parameters"]["XHubSignature"];
            };
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
        };
    };
    HandleGitlabWebhook: {
        parameters: {
            query?: never;
            header: {
                "X-Gitlab-Token": components["parameters"]["XGitlabToken"];
                "X-Gitlab-Event": components["parameters"]["XGitlabEvent"];
            };
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
        };
    };
    SetNextAppVersion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestServiceStackNextAppVersion"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetNginxConfFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseNginxConfig"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetObjectStorageSize: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackDiskGBytesUsed"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateObjectStorageSize: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutServiceStackObjectStorageSize"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListServiceStackProcesses: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                statuses?: components["parameters"]["statuses"];
                actionNameContains?: components["parameters"]["actionNameContains"];
                /** @description Fields to sort by: created, actionName. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListServiceStackPublicPortRoutings: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                /** @description Fields to sort by: created, publicPort. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicPortRoutingList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreatePublicPortRouting: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPublicPortRouting"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponsePublicPortRouting"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ReloadServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RestartServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListServiceStackServices: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                /** @description Fields to sort by: created. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    StartServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    StopServiceStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    TriggerExternalRepositoryIntegration: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutStandardServiceStackTriggerExternalRepositoryIntegration"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    PutTriggerPipeline: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestPutStandardServiceStackTriggerPipeline"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcessNil"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateServiceStackUiAccess: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseServiceStackUi"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListServiceStackUserData: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
                keyContains?: components["parameters"]["keyContains"];
                /** @description Fields to sort by: created, key. Prefix a field with '-' for descending order. */
                sort?: string[] | null;
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserDataList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateUserData: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserDataPost"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetUserDataEnvFileForEdit: {
        parameters: {
            query?: {
                sensitive?: components["parameters"]["sensitive"];
            };
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseEnvFile"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateUserDataEnvFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserDataPutEnvFile"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ValidateZeropsYaml: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestZeropsYamlValidation"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
        };
    };
    GetSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSettings"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetCountryList: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSettingsCountryList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetImportProjectYamlJsonSchema: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
        };
    };
    GetImportProjectYmlJsonSchema: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
        };
    };
    GetZeropsYmlJsonSchema: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
        };
    };
    GetZeropsYamlJsonSchema: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseFileDownload"];
                };
            };
        };
    };
    GetUserDataById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserData"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateUserDataById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserDataPut"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteUserDataById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseProcess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetUserDataSensitiveValue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserDataReveal"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetUserNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserNotification"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    AcknowledgeUserNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    AcknowledgeAllUserNotifications: {
        parameters: {
            query?: never;
            header?: {
                Sync?: components["parameters"]["Sync"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserNotification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    CreateUserToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserToken"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserTokenRaw"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetUserToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserToken"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RenameUserToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserToken"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserToken"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    DeleteUserTokenById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListUserTokens: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserTokenList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    UpdateUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserPut"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUser"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ReSendVerificationEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    AuthorizeClient: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestClientAuthorize"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserAuthorize"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ListUserClients: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                offset?: components["parameters"]["offset"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseClientUserExtraWithClientLightList"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetUserInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseUserAuthorize"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ChangePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserPutPassword"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    ChangePasswordViaToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestUserPutPasswordViaToken"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthFull"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    RecoverPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestRecoverPassword"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    VerifyUserEmail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    fido2LoginCeremonyFinish: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestWebAuthnLoginVerification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseAuthLogin"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    fido2LoginCeremonyStart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseWebAuthnOptions"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    fido2RegistrationCeremonyFinish: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestWebAuthnRegistrationVerification"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseWebAuthnRegistrationVerification"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    fido2RegistrationCeremonyStart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RequestWebAuthnRegistrationOptions"];
            };
        };
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseWebAuthnOptions"];
                };
            };
            /** @description Error response */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    GetZcliVersion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseZcliVersion"];
                };
            };
        };
    };
    PurgeStaticCdn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: components["parameters"]["id"];
                domain: components["parameters"]["domain"];
                path: components["parameters"]["path"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    PurgeStorageCdn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description = stack.id in Zerops Infrastructure */
                id: string;
                path: components["parameters"]["path"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseSuccess"];
                };
            };
            /** @description Error response */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
            /** @description Error response */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
