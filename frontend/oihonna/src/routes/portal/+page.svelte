<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { getUserData, checkAuth } from '../../stores/auth';
    import MainLayout from '../MainLayout.svelte';

    let user;

    onMount(async () => {
        const isAuthed = await checkAuth();
        if (!isAuthed){
            goto('/home');
        }else{
            user = await getUserData();
        }

    });

</script>

<MainLayout>
    <slot>
        <a href="https://docs.google.com/spreadsheets/d/1Q_LdCH58wXy7IaWreKvZ2-uVPb3gybBtKu-8sK_UlrQ/edit?gid=0#gid=0"><h1>Sheets</h1></a>
        <a href="https://docs.google.com/spreadsheets/d/1Q_LdCH58wXy7IaWreKvZ2-uVPb3gybBtKu-8sK_UlrQ/edit?gid=0#gid=0"><h1>Voyage logging</h1></a>
    </slot>
</MainLayout>