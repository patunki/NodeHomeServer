<script>
    import Chat from "../../components/Chat.svelte";
    import MainLayout from "../MainLayout.svelte";
</script>

<MainLayout>
    <slot>
      <Chat />
    </slot>
  </MainLayout>