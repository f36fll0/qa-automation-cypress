class Account {
    elements = {
        editAccount: () => cy.xpath("//a[normalize-space()='Edit Account']"),
        password: () => cy.xpath("//a[normalize-space()='Password']"),
        addressBook: () => cy.xpath("//a[@class='list-group-item'][normalize-space()='Address Book']"),
        wishList: () => cy.xpath("//a[@class='list-group-item'][normalize-space()='Wish List']"),
        orderHistory: () => cy.xpath("//a[@class='list-group-item'][normalize-space()='Order History']"),
        logout: () => cy.get('a.list-group-item[href*="route=account/logout"]', { timeout: 10000 }),
        continuebutton: () => cy.xpath("//button[normalize-space()='Continue']")
    };

    clickEditAccount() {
        this.elements.editAccount().should('be.visible').click();
    }

    clickPassword() {
        this.elements.password().should('be.visible').click();
    }

    clickAddressBook() {
        this.elements.addressBook().should('be.visible').click();
    }

    clickWishList() {
        this.elements.wishList().should('be.visible').click();
    }

    clickOrderHistory() {
        this.elements.orderHistory().should('be.visible').click();
    }

    clickLogout() {
        this.elements.logout().should('be.visible').click();
    }

    clickContinue() {
        this.elements.continuebutton().should('be.visible').click();
    }
}

export default new Account();
