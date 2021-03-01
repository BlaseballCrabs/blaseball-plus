import parseSVG from './parseSVG.js';
import { createPopper } from '@popperjs/core';

let tooltips = [];

export default function addAttribute(item, { color, bg, border, title, desc, svg }) {
    console.log('adding');

    let bar = item.querySelector('.ModalItem-Attributes > .AttributeBar');

    if (!bar) {
        let attributes = document.createElement('div');
        attributes.classList.add('ModalItem-Attributes');

        bar = document.createElement('div');
        bar.classList.add('AttributeBar');
        attributes.append(bar);

        const content = item.querySelector('.ModalItem-Content');
        const pane = content.closest('.tab-pane');
        pane.insertBefore(attributes, content);
    }

    let holder = document.createElement('div');
    holder.classList.add('AttributeIcon');

    let icon = document.createElement('div');
    icon.classList.add('AttributeIcon');
    icon.style.color = color;
    icon.style.backgroundColor = bg;
    icon.style.border = `2px solid ${border}`;
    icon.append(parseSVG(svg));

    let tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.classList.add('AttributeTooltip', 'fade', 'tooltip');

    let tooltipInner = document.createElement('div');
    tooltipInner.classList.add('tooltip-inner');

    let container = document.createElement('div');
    container.classList.add('AttributeTooltip-Container');

    let header = document.createElement('div');
    header.classList.add('AttributeTooltip-Header');
    header.style.color = color;
    header.textContent = title;
    container.append(header);

    let description = document.createElement('div');
    description.classList.add('AttributeTooltip-Description');
    description.textContent = desc;
    container.append(description);

    let divider = document.createElement('div');
    divider.classList.add('AttributeTooltip-Divider');
    container.append(divider);

    let plusHeader = document.createElement('div');
    plusHeader.classList.add('AttributeTooltip-Header');
    plusHeader.style.color = border;
    plusHeader.textContent = 'Blaseball+';
    container.append(plusHeader);

    let plusDescription = document.createElement('div');
    plusDescription.classList.add('AttributeTooltip-Description');
    plusDescription.textContent = 'This attribute was added by Blaseball+.';
    container.append(plusDescription);

    tooltipInner.append(container);
    tooltip.append(tooltipInner);

    let remover = {
        dispose() {}
    };
    tooltips.push(remover);

    let popper = null;

    function removeTooltip() {
        if (popper) popper.destroy();
        tooltip.remove();
        remover.dispose = () => {};
    }

    function showTooltip() {
        tooltip.removeEventListener('transitionend', removeTooltip);

        document.body.append(tooltip);

        remover.dispose = removeTooltip;

        popper = createPopper(icon, tooltip, {
            placement: 'bottom-start',
            onFirstUpdate: () => {
                tooltip.classList.add('show');

                let fullyShown = false;

                icon.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('show');

                    if (fullyShown) {
                        tooltip.addEventListener('transitionend', removeTooltip, { once: true });
                    } else {
                        removeTooltip();
                    }
                }, { once: true });

                tooltip.addEventListener('transitionend', () => {
                    fullyShown = true;
                }, { once: true });
            }
        });
    }

    icon.addEventListener('mouseenter', showTooltip);

    holder.append(icon);

    bar.append(holder);

    return icon;
}

export function removeAttributes() {
    console.log('disposing');

    for (const tooltip of tooltips) {
        tooltip.dispose();
    }

    tooltips = [];
}
