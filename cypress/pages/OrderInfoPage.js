class orderInfo {
    elements = {
        orderId: () => cy.get('.form-control'),
        address: () => cy.get('.form-control'),
        product: () => cy.get('table.table-bordered.table-hover tbody tr')
    };

    checkOrderId() {
        return this.elements.orderId()
            .invoke('text')
            .then(text => {
            const match = text.match(/Order ID\s+(\d+)/);
            return `#${match[1]}`;
        });
    }

    checkAddress(name, street, city, postcode) {
        return this.elements.address()
            .should('contain.text', name)
            .and('contain.text', street)
            .and('contain.text', city)
            .and('contain.text', postcode);
    }

    checkProduct(product) {
        return this.elements.product().contains(product);
    }
}

export default new orderInfo();
