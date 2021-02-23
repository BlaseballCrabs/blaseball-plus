export default async function patch(bigDealWrapper) {
    const noBigDeal = window.wrappedJSObject.noBigDeal;
    if (!noBigDeal) return;

    const bigDeal = bigDealWrapper.querySelector('.BigDeal-All');
    noBigDeal();

    bigDeal.classList.add('NoBigDeal');

    const header = document.querySelector('.Header');
    header.append(bigDeal);
}
