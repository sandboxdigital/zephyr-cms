const ModalMixins = {
    data () {
        return {
            modalVisible:true
        };
    },

    methods : {
        modalReturn (data) {
            this.$emit('modal-return', data);
            this.modalVisible = false;
        },

        modalClose () {
            this.modalVisible = false;
        },

        onModalHide () {
            this.modalVisible = false;
            this.$emit('modal-hidden');
        }
    }
};

export default ModalMixins;