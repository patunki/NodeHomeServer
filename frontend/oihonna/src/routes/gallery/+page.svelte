<script>
    import { onMount } from 'svelte';
    import MainLayout from '../MainLayout.svelte';
    let selectedFolder = 'default'; // Default folder to display
    let files = [];
    let imageFile = null;
    let folderName = '';
    let folders = [];
    let showUploadSection = false; // State to toggle the upload section
  
    // Fetch the images from the selected folder
    const getImages = async () => {
      const res = await fetch(`http://localhost:3000/api/gallery/${selectedFolder}`);
      if (res.ok) {
        const data = await res.json();
        files = data.files;
      } else {
        console.error('Failed to load images');
      }
    };
  
    // Fetch available folders
    const getFolders = async () => {
      const res = await fetch('http://localhost:3000/api/folders');
      if (res.ok) {
        const data = await res.json();
        folders = data.folders;
      } else {
        console.error('Failed to fetch folders');
      }
    };
  
    // Upload the selected image to the selected folder
    const uploadImage = async () => {
      if (!imageFile) {
        alert('Please select an image first!');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('folder', selectedFolder);
  
      const res = await fetch('http://localhost:3000/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log(data.message);
        getImages(); // Refresh the gallery
      } else {
        console.error('Failed to upload image');
      }
    };
  
    // Create a new folder
    const createFolder = async () => {
      if (!folderName) {
        alert('Please enter a folder name');
        return;
      }
  
      const res = await fetch('http://localhost:3000/api/gallery/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });
  
      if (res.ok) {
        console.log('Folder created successfully');
        getFolders(); // Refresh the list of folders
        folderName = ''; // Clear input
      } else {
        console.error('Failed to create folder');
      }
    };
  
    // Fetch data when component mounts
    onMount(() => {
      getFolders();
      getImages();
    });
  
    let expandedImage = null;
    const expandImage = (image) => {
      expandedImage = image;
    };
  
    const closeExpandedImage = () => {
      expandedImage = null;
    };
  </script>
  
  <MainLayout>
    <slot>
      <div class="container">
        <h1>Gallery</h1>
  
        <!-- Button to toggle Upload Section -->
        <button class="toggle-upload-btn" on:click={() => showUploadSection = !showUploadSection}>
          {showUploadSection ? 'Hide Upload Section' : 'Show Upload Section'}
        </button>
  
        {#if showUploadSection}
          <!-- Upload Section -->
          <div class="upload-section">
            <h3>Upload Image</h3>
            <div class="folder-selector">
              <label for="folder-select">Select Folder:</label>
              <select id="folder-select" bind:value={selectedFolder}>
                {#each folders as folder}
                  <option value={folder}>{folder}</option>
                {/each}
              </select>
            </div>
            <div class="file-input">
              <label for="file-upload" class="upload-label">Choose Image:</label>
              <input type="file" id="file-upload" accept="image/*" on:change="{(e) => imageFile = e.target.files[0]}" />
            </div>
            <button class="upload-btn" on:click="{uploadImage}">Upload Image</button>
  
            <h3>Create New Folder</h3>
            <div class="folder-input">
              <label for="folder-name">Folder Name:</label>
              <input type="text" id="folder-name" bind:value={folderName} placeholder="Enter folder name" />
            </div>
            <button class="create-folder-btn" on:click="{createFolder}">Create Folder</button>
          </div>
        {/if}
  
        <!-- Browse Folders -->
        <div class="folder-list">
          <h3>Browse Folders</h3>
          <ul>
            {#each folders as folder}
              <li>
                <button on:click={() => { selectedFolder = folder; getImages(); }}>{folder}</button>
              </li>
            {/each}
          </ul>
        </div>
  
        <!-- Image Gallery -->
        <div class="image-gallery">
          {#each files as file}
            <div class="image-item" on:click={() => expandImage(`http://localhost:3000/uploads/${selectedFolder}/${file}`)}>
              <img src={`http://localhost:3000/uploads/${selectedFolder}/${file}`} alt="image" />
            </div>
          {/each}
        </div>
  
        {#if expandedImage}
          <div class="expanded-image" on:click="{closeExpandedImage}">
            <img src="{expandedImage}" alt="expanded image" />
          </div>
        {/if}
      </div>
    </slot>
  </MainLayout>
  
  <style>
    /* Container to wrap all content and center it */
    .container {
      width: 80%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: space-between;
    }
  
    /* Left section (Upload and Folder List) */
    .upload-section {
      width: 30%;
      background-color: #2c2f3e;
      color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  
    .upload-section h3 {
      margin-bottom: 10px;
      font-size: 1.2rem;
    }
  
    .folder-selector, .file-input, .folder-input {
      margin-bottom: 15px;
    }
  
    .folder-selector label, .file-input label, .folder-input label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }
  
    select, input[type="file"], input[type="text"] {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  
    .upload-btn, .create-folder-btn {
      padding: 12px 20px;
      font-size: 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }
  
    .upload-btn:hover, .create-folder-btn:hover {
      background-color: #45a049;
    }
  
    .folder-list ul {
      list-style-type: none;
      padding: 0;
    }
  
    .folder-list li {
      margin-bottom: 5px;
    }
  
    .folder-list button {
      background-color: #0066cc;
      color: white;
      padding: 8px 12px;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }
  
    .folder-list button:hover {
      background-color: #005bb5;
    }
  
    /* Image Gallery */
    .image-gallery {
      width: 65%;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  
    .image-item {
      width: 150px;
      height: 150px;
      overflow: hidden;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    /* Expanded Image View */
    .expanded-image {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
  
    .expanded-image img {
      max-width: 90%;
      max-height: 90%;
    }
  
    .expanded-image:hover {
      cursor: pointer;
    }
  
    /* Button to toggle Upload Section */
    .toggle-upload-btn {
      background-color: #0066cc;
      color: white;
      padding: 10px 20px;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 20px;
    }
  
    .toggle-upload-btn:hover {
      background-color: #005bb5;
    }
  </style>
  