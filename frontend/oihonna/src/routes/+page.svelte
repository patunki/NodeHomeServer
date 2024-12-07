<script>
    import MainLayout from "./MainLayout.svelte";
</script>

<head>
    <title>Oihonna</title>
</head>

<MainLayout>
    <slot>
        <div class="main-content">
            <h1>Oihonna II</h1>
            <p>Hiton hyvä kotisivu</p>
    
            <div class="gallery">
                <a href="/chat" class="gallery-item">
                    <img src="../src/public/sot1.png" alt="Chat" />
                    <div class="overlay">
                        <span>Chat</span>
                    </div>
                </a>
                <a href="/map" class="gallery-item">
                    <img src="../src/public/map.png" alt="Map" />
                    <div class="overlay">
                        <span>Map</span>
                    </div>
                </a>
                <a href="/gallery" class="gallery-item">
                    <img src="../src/public/oihonna2.png" alt="Gallery" />
                    <div class="overlay">
                        <span>Gallery</span>
                    </div>
                </a>
                <a href="/live" class="gallery-item">
                    <img src="../src/public/oihonna3.png" alt="Live" />
                    <div class="overlay">
                        <span>Live</span>
                    </div>
                </a>
            </div>
            
        </div>
    </slot>
</MainLayout>

<style>


/* Main content styles */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    color: navy;
}

p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    color: #bdc3c7;
}

.gallery {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.gallery img {
    margin: 10px;
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
    transition: transform 0.3s ease;
}

.gallery img:hover {
    transform: scale(1.05);
}

.gallery {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.gallery-item {
    position: relative; /* This makes the overlay position relative to the image */
    margin: 10px;
    width: 200px;
    height: 150px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.gallery-item:hover img {
    transform: scale(1.05); /* Slight zoom effect on hover */
}

/* Overlay styles */
.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    opacity: 0;
    transition: opacity 0.3s ease;
}

.overlay span {
    color: #f5f5f5;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8); /* Add shadow for better readability */
}

.gallery-item:hover .overlay {
    opacity: 1; /* Show the overlay on hover */
}
    </style>