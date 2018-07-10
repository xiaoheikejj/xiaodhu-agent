<template lang="html">
    <div id="AddMerchantsRouter" style="width:100%;">
        <div class="main-hd">
          <div class="hd-title">新增商户</div>
        </div>
        <div class="router-title">
          <ul>
            <li class="active">企业用户</li>
            <!-- <li>|</li>
            <li >个人用户</li> -->
          </ul>
        </div>
        <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
</template>

<script>
import NewAddMerchants from "./NewAddMerchants";
export default {
  name: "AddMerchantsRouter",
  components: {
    NewAddMerchants
  },
  data() {
    return {
      
    }
  }
}
</script>