<script>
    import { loggedIn } from "../../stores/auth";
    import { writable } from "svelte/store";
    import MainLayout from "../MainLayout.svelte";

    const storedUser = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
</script>

<MainLayout>
    <slot>
        <p >{user.username}</p>
        <p >{user.email}</p>
        <p >{user.id}</p>
    </slot>
</MainLayout>

