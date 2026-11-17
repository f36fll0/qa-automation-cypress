class AdressBookEntries {
    elements = {
        backbutton: () => cy.xpath("//a[@class='btn btn-light']"),
        newaddressbutton: () => cy.contains('a', 'New Address')
    };

    clickNewAddress() {
        this.elements.newaddressbutton().click();
    }

    backButton() {
        this.elements.backbutton();
    }
}

export default new AdressBookEntries();
