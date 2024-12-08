<script>
    import { loggedIn } from "../../stores/auth";
    import { writable } from "svelte/store";
    import MainLayout from "../MainLayout.svelte";
    import { onMount } from "svelte";
    import { getUserData } from "../../stores/auth";


    let user = null;
    
    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        } else {
            console.log("No user data found in localStorage.");
        }
    });
 
</script>
 
<!-- svelte-ignore a11y_img_redundant_alt -->
<MainLayout>
    <slot>
        {#if user}
            <div class="profile-container">
                <div class="profile-header">
                    <img src="{user.picture}" alt="Profile Picture" class="profile-picture">
                    <div class="profile-info">
                        <h2>{user.username}</h2>
                        <p class="role">{user.role}</p>
                        <p class="membership-status">{user.member === 1 ? 'Member' : 'Not a Member'}</p>
                    </div>
                </div>

                <div class="bio-section">
                    <h3>Bio</h3>
                    <p>{user.bio || 'No bio available'}</p>
                </div>

                <div class="create-time-section">
                    <h3>Account Created</h3>
                    <p>{new Date(user.create_time).toLocaleDateString()}</p>
                </div>
            </div>
        {:else}
            <p>Loading user data...</p>
        {/if}
    </slot>
</MainLayout>

<style>
    /* Dark theme styles */
    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background-color: #1c1c1c; /* Dark background */
        color: #eaeaea; /* Light text color */
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
    }

    .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        text-align: center;
    }

    .profile-picture {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        object-fit: cover;
        margin-right: 20px;
        border: 2px solid #eaeaea; /* Light border for the picture */
    }

    .profile-info h2 {
        font-size: 1.5rem;
        margin: 0;
        color: #f4f4f4; /* Lighter color for the username */
    }

    .role {
        font-size: 1.1rem;
        color: #bbb; /* Slightly dimmed color for the role */
    }

    .membership-status {
        font-size: 1rem;
        color: #888; /* Dimmed color for membership status */
    }

    .bio-section, .create-time-section {
        margin-top: 20px;
        text-align: left;
        width: 100%;
    }

    .bio-section h3, .create-time-section h3 {
        font-size: 1.2rem;
        color: #f4f4f4; /* Light color for headings */
        margin-bottom: 10px;
    }

    .bio-section p, .create-time-section p {
        font-size: 1rem;
        color: #ccc; /* Light color for the bio and account time */
    }

    /* Add a hover effect to the sections for interactivity */
    .bio-section:hover, .create-time-section:hover {
        background-color: #2a2a2a;
        padding: 10px;
        border-radius: 5px;
    }
</style>
