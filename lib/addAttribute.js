import $ from 'jquery';
import 'bootstrap/js/dist/tooltip.js';

let attributes = [];

export default function addAttribute(item, { color, bg, border, title, desc, svg }) {
    let bar = item.querySelector('.ModalItem-Attributes > .AttributeBar');

    if (!bar) {
        let attributes = document.createElement('div');
        attributes.classList.add('ModalItem-Attributes');

        bar = document.createElement('div');
        bar.classList.add('AttributeBar');
        attributes.append(bar);

        const content = item.querySelector('.ModalItem-Content');
        item.insertBefore(attributes, content);
    }

    let holder = document.createElement('div');
    holder.classList.add('AttributeIcon');

    let icon = document.createElement('div');
    icon.classList.add('AttributeIcon');
    icon.style.color = color;
    icon.style.backgroundColor = bg;
    icon.style.border = `2px solid ${border}`;
    icon.innerHTML = svg;

    let tooltip = document.createElement('div');
    tooltip.classList.add('AttributeTooltip-Container');

    let header = document.createElement('div');
    header.classList.add('AttributeTooltip-Header');
    header.style.color = color;
    header.textContent = title;
    tooltip.append(header);

    let description = document.createElement('div');
    description.classList.add('AttributeTooltip-Description');
    description.textContent = desc;
    tooltip.append(description);

    let divider = document.createElement('div');
    divider.classList.add('AttributeTooltip-Divider');
    tooltip.append(divider);

    let plusHeader = document.createElement('div');
    plusHeader.classList.add('AttributeTooltip-Header');
    plusHeader.style.color = border;
    plusHeader.textContent = 'Blaseball+';
    tooltip.append(plusHeader);

    let plusDescription = document.createElement('div');
    plusDescription.classList.add('AttributeTooltip-Description');
    plusDescription.textContent = 'This attribute was added by Blaseball+.';
    tooltip.append(plusDescription);

    $(icon).tooltip({
        container: 'body',
        placement: 'bottom',
        offset: '50%p - 50%r, 0',
        html: true,
        title: tooltip,
        sanitize: false,
        template: '<div class="tooltip AttributeTooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    });

    attributes.push(icon);

    holder.append(icon);

    bar.append(holder);

    return icon;
}

export function removeAttributes() {
    for (const attribute of attributes) {
        $(attribute).tooltip('dispose');
    }

    attributes = [];
}
