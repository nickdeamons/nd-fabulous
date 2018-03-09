<template>
    <div v-on:click="hi" class='test'>
        
        {{message}}
    </div>
</template>
<script>
export default {
  data() {
    return {
      message: "My first view component is here!"
    };
  },
  created: function() {
    
  },
  methods: {
    hi: function() {
      alert("hi");
    }
  }
};
</script>