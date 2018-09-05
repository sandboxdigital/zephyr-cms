<template>
    <div class="cms-row" :class="rowClass">
        <div class="cms-label"><label>{{label}}</label></div>
        <div class="cms-field" :class="fieldClass">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            label: {type: String},
            fieldClass: {type: String},
            rowClass: {type: String},
        },
    }
</script>