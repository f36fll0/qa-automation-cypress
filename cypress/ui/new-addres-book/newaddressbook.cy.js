import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import AccountPage from "../../pages/AccountPage";
import AddAddressBookPage from "../../pages/AddAddressBookPage";
import AddressBookEntriesPage from "../../pages/AddressBookEntriesPage";

describe('Address Book', () => {
    let validUser;
    let validAddress;
    let validAddress2;
    const requiredFields = ['firstname', 'lastname', 'address', 'city', 'country'];

    beforeEach(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
        });
        cy.fixture('addresses').then((data) => {
            validAddress = data.addressBook;
            validAddress2 = data.addressBook2;
        });
    });

    it('Create and persist address', () => {
        const user = {
            firstname: validUser.firstname,
            lastname: validUser.lastname,
            email: `fran${Date.now()}@gmail.com`,
            password: validUser.password
        };
        RegisterPage.visit();
        cy.registerUser(user);
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.fieldAddressBookForm(validAddress);
        AccountPage.clickContinue();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Fran Lopez')
            .should('contain.text', 'LopezSA')
            .and('contain.text', 'Libertad 32')
            .and('contain.text', 'Cordoba, Córdoba 000001')
            .and('contain.text', 'Spain');
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        cy.contains('td', 'Fran Lopez')
            .should('contain.text', 'LopezSA')
            .and('contain.text', 'Libertad 32')
            .and('contain.text', 'Cordoba, Córdoba 000001')
            .and('contain.text', 'Spain');
    });

    it('Show validation errors when required fields are empty', () => {
        const user = {
            firstname: validUser.firstname,
            lastname: validUser.lastname,
            email: `fran${Date.now()}@gmail.com`,
            password: validUser.password
        };
        RegisterPage.visit();
        cy.registerUser(user);
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        requiredFields.forEach(field => {
            user[field] = '';
        });
        AccountPage.clickContinue();
        AddAddressBookPage.emptyNewAddressFields(user);
        AddAddressBookPage.countryField();
        AccountPage.clickContinue();
        AddAddressBookPage.verifyErrorCountry();
    });

    it('Delete Address', () => {
        const user = {
            firstname: validUser.firstname,
            lastname: validUser.lastname,
            email: `fran${Date.now()}@gmail.com`,
            password: validUser.password
        };
        RegisterPage.visit();
        cy.registerUser(user);
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.fieldAddressBookForm(validAddress);
        AccountPage.clickContinue();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Fran Lopez')
            .should('contain.text', 'LopezSA')
            .and('contain.text', 'Libertad 32')
            .and('contain.text', 'Cordoba, Córdoba 000001')
            .and('contain.text', 'Spain');
        AddAddressBookPage.deleteAddress(validAddress.firstname);
        cy.get('.alert').should('be.visible').and('contain', 'Warning: You must have at least one address!');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.fieldAddressBookForm(validAddress2);
        AccountPage.clickContinue();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Juan Muñoz')
            .should('contain.text', 'MuñozSA')
            .and('contain.text', 'Humildad 33')
            .and('contain.text', 'Cuenca, Cuenca 000023')
            .and('contain.text', 'Spain');
        AddAddressBookPage.deleteAddress(validAddress2.firstname);
        cy.get('.alert')
            .should('be.visible')
            .and('contain', 'Your address has been successfully deleted');
        cy.get('tbody tr').should('not.contain.text', 'Juan Muñoz');
        cy.get('tbody tr').should('contain.text', 'Fran Lopez');
    });

    it('Edit address', () => {
        const user = {
            firstname: validUser.firstname,
            lastname: validUser.lastname,
            email: `fran${Date.now()}@gmail.com`,
            password: validUser.password
        };
        RegisterPage.visit();
        cy.registerUser(user);
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.fieldAddressBookForm(validAddress2);
        AccountPage.clickContinue();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Juan Muñoz').should('contain.text', 'Humildad 33');
        AddAddressBookPage.editAddress(validAddress2.firstname);
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.entryAddress('Pio Baroja 13');
        AddAddressBookPage.editContinue();
        cy.get('.alert').should('be.visible').and('contain', 'Your address has been successfully updated');
        AddAddressBookPage.clickAddressBookBreadcrumb();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Juan Muñoz')
            .should('contain.text', 'MuñozSA')
            .and('contain.text', 'Pio Baroja 13')
            .and('contain.text', 'Cuenca, Cuenca 000023')
            .and('contain.text', 'Spain');
    });
});
