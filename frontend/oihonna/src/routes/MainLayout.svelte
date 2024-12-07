<script>
    import { writable } from 'svelte/store';
    import 'iconify-icon';

    let dropdownOptions = ["Home", "About", "Gallery", "Contact"];
    let isDropdownOpen = writable(false);

    const toggleDropdown = () => {
        isDropdownOpen.update(current => !current);
    };

    const selectOption = (option) => {
        isDropdownOpen.set(false); // Close dropdown after selection
    };
</script>

<div class="app-container">
    <!-- Header with dropdown on the left and login on the right -->
    <header>
        <!-- Hamburger Menu -->
        <iconify-icon icon="charm:menu-hamburger" width="32" height="32" style="color: #e1e1e1" class="hamburger-menu" on:click="{toggleDropdown}"></iconify-icon>

        <!-- Dropdown Menu -->
        {#if $isDropdownOpen}
            <div class="dropdown-options">
                {#each dropdownOptions as option}
                    <!-- Link to different pages -->
                    <a href="/{option.toLowerCase()}" class="dropdown-link">
                        <button on:click="{() => selectOption(option)}">{option}</button>
                    </a>
                {/each}
            </div>
        {/if}

        <div class="header-buttons">
            <button class="buttons">Login</button>
            <button class="buttons">Sign up</button>
        </div>
    </header>

    <!-- Main content (Slot for page-specific content) -->
    <main>
        <slot></slot>
    </main>

    <!-- Footer -->
    <footer>
        &copy; 2024 Oihonna II Crew. All rights reserved.
    </footer>
</div>

<style>
    :global(body) {
        background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('../src/public/oihonna1.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        color: black;
        transition: background-color 0.3s;
        margin: 0;
        padding: 0;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Ensure the layout takes up the entire height of the screen */
    }

    /* Main content should grow to fill the remaining space */
    main {
        flex: 1; /* This will make the main content take up the remaining space */
    }

    /* Header styles */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #1e1e1e;
        padding: 10px 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    }

    .hamburger-menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 32px;
        width: 32px;
        cursor: pointer;
    }

    .dropdown-options {
        position: absolute;
        top: 50px;
        left: 20px;
        background: #292929;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .dropdown-options button {
        background: none;
        color: #f5f5f5;
        border: none;
        padding: 10px 15px;
        text-align: left;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s ease;
        border-radius: 5px;
    }

    .dropdown-options button:hover {
        background: #444;
    }

    .header-buttons {
        display: flex;
        gap: 10px;
    }

    .buttons {
        background-color: #f39c12;
        border: none;
        color: #121212;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .buttons:hover {
        background-color: #e67e22;
    }

    /* Footer */
    footer {
        text-align: center;
        padding: 10px;
        background: #1e1e1e;
        font-size: 0.9rem;
        color: #bdc3c7;
        margin-top: auto; /* Pushes footer to the bottom */
    }
</style>
