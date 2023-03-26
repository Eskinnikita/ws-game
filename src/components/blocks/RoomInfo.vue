<template>
    <div
        class="info-bar"
        v-if="clients"
    >
        <div>
            <span>Clients count = {{ clients.count }}</span> <span style="color: green">*Press T to open chat*</span>
            <div
                v-for="(message, index) in messages"
                :key="index"
            >
                {{ message.name }}: {{ message.text }}
            </div>
        </div>
        <div>
            <div
                v-for="(client, index) in clients.connected"
                :key="index"
            >
                {{ client.name }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    clients: {
      type: Object,
      required: true
    },
    messages: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.info-bar {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  height: 120px;
  overflow-y: hidden;
}
</style>