import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import HeaderPage from "../../pages/HeaderPage";
import AddAddressBookPage from "../../pages/AddAddressBookPage";
import CatalogPage from "../../pages/CatalogPage";
import AddressBookEntriesPage from "../../pages/AddressBookEntriesPage";
import AccountPage from "../../pages/AccountPage";
import ProductCategoryPage from "../../pages/ProductCategoryPage";
import ProductPage from "../../pages/ProductPage";

describe('check the products catalog', () => {
    let validUser;
    let validAddress;

    before(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
        });
        cy.fixture('addresses').then((data) => {
            validAddress = data.addressBook;
        });
    });

    beforeEach(() => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`
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
        cy.url({ timeout: 10000 }).should('include', 'route=account/account');
    });

    it('search the product in the catalog', () => {
        const product = 'mac';
        HeaderPage.inputSearch(product);
        HeaderPage.searchButton();
        CatalogPage.productCatalogResults().each(($el) => {
            expect($el.text().trim().toLowerCase()).to.include(product.toLowerCase());
            console.log('showing the founded elements :', $el.text().trim());
        });
    });

    it('search an inexistant product', () => {
        const product = 'trsr';
        HeaderPage.inputSearch(product);
        HeaderPage.searchButton();
        CatalogPage.productCatalogResults().should('not.exist');
    });

    it('show the products of the desktop components', () => {
        const productList = [];
        HeaderPage.components();
        HeaderPage.showAllComponents();
        cy.url().should('include', 'route=product/category');
        ProductCategoryPage.desktops();
        ProductCategoryPage.inputLimit();
        cy.fixture('components').then((data) => {
            const list = data.components;
            ProductCategoryPage.productCatalogResults().each(($el) => {
                productList.push($el.text().trim().replace(/"$/, ''));
            }).then(() => {
                list.forEach((product) => {
                    expect(productList).to.include(product);
                });
            });
        });
    });

    it('show the name and the price in the product detail', () => {
        const productName = 'HP LP3065';
        HeaderPage.components();
        HeaderPage.showAllComponents();
        cy.url().should('include', 'route=product/category');
        ProductCategoryPage.desktops();
        ProductCategoryPage.inputLimit();
        ProductCategoryPage.selectProduct(productName);
        cy.url().should('include', 'route=product/product');
        ProductPage.checkProduct().then((data) => {
            const product = data;
            expect(product).have.to.equal(productName);
            cy.log(`The product is :", ${product}`);
            ProductPage.price().invoke('text').then((data) => {
                const price = data;
                cy.log(`The price is :",${price}`);
            });
        });
    });

    it('check the product by rising price', () => {
        const listPrice = [];
        HeaderPage.components();
        HeaderPage.showAllComponents();
        cy.url().should('include', 'route=product/category');
        ProductCategoryPage.desktops();
        ProductCategoryPage.inputLimit();
        ProductCategoryPage.inputShortRisingPrice();
        ProductCategoryPage.priceList().each(($el) => {
            listPrice.push(Number($el.text().trim().replace(/[^0-9.]/g, '')));
        }).then(() => {
            for (let i = 0; i < listPrice.length - 1; i++) {
                expect(listPrice[i]).to.be.at.most(listPrice[i + 1]);
            }
        });
    });

    it('display products in ascending alphabetical order', () => {
        const listAlphabetic = [];
        HeaderPage.components();
        HeaderPage.showAllComponents();
        cy.url().should('include', 'route=product/category');
        ProductCategoryPage.desktops();
        ProductCategoryPage.inputLimit();
        ProductCategoryPage.inputShortRisingName();
        ProductCategoryPage.productCatalogResults().each(($el) => {
            listAlphabetic.push($el.text().trim());
        }).then(() => {
            for (let i = 1; i < listAlphabetic.length - 1; i++) {
                expect(listAlphabetic[i].localeCompare(listAlphabetic[i + 1])).to.be.at.most(0);
            }
        });
    });
});
