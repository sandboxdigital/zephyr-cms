import jQuery from 'jquery';

const ModalService = {
    createModal (ModalController, Vue, context, data = {}) {

        let ComponentClass = Vue.extend(ModalController);
        let modal = new ComponentClass({
            data:data,
        });

        let destroyModal = function () {
            setTimeout(() => {
                jQuery(modal.$el).remove();
                modal.$destroy();
                modal = null;
                jQuery('html').removeClass('modal-visible');
            },750);
        };

        modal.$mount(); // pass nothing mounts in shadow dom
        context.$root.$el.appendChild(modal.$el);

        jQuery('html').addClass('modal-visible');

        return new Promise((resolve, reject) => {
            modal.$on('modal-cancel', () => {
                resolve({status:'cancel'});
                destroyModal ();
            });

            modal.$on('modal-return', (ev) => {
                resolve({status:'success', data:ev});
            });

            modal.$on('modal-hidden', (ev) => {
                destroyModal();
            });
        });
    }
};



export default ModalService;