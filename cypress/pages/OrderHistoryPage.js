class orderHistory {
    elements = {
        title: () => cy.get('h1'),
        orderRows: () => cy.get('table tbody tr'),
        continueButton: () => cy.get('.btn.btn-primary')
    };

    verifyPage() {
        this.elements.title().should('have.text', 'Orders');
    }

    verifyOrdersExist() {
        this.elements.orderRows().should('have.length.greaterThan', 0);
    }

    getOrderId() {
        return this.elements.orderRows().first().find('td').first().invoke('text').then((orderId) => orderId.trim());
    }

    viewOrder(orderId) {
        this.elements.orderRows(orderId)
            .contains(orderId)
            .parent('tr')
            .within(() => {
            cy.get('a').click();
        });
    }

    clickContinue() {
        this.elements.continueButton().click();
    }
}

export default new orderHistory();
