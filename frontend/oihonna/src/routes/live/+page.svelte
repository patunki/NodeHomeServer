<script>
    import MainLayout from "../MainLayout.svelte";
    import Chat from "../../components/Chat.svelte";// Assuming you have a Chat component
    import { onMount } from "svelte";

    let streamUrl = "https://path_to_your_stream.m3u8"; // Example stream URL (HLS)
    let chatMessages = []; // Placeholder for chat messages

    // Simulate adding messages
    onMount(() => {
        setInterval(() => {
            // Simulating incoming messages every 5 seconds for demo purposes
            chatMessages.push({
                username: "User" + (chatMessages.length + 1),
                message: "Hello, this is a test message!",
            });
        }, 5000);
    });
</script>

<MainLayout>
    <slot>
        <div class="live-stream-page">
            <div class="live-stream-container">
                <h1>Live Stream</h1>
                <video width="100%" height="auto" controls autoplay>
                    <source src="{streamUrl}" type="application/x-mpegURL">
                    Your browser does not support the video tag.
                </video>
            </div>

            <div class="chat-container">
                <Chat {chatMessages} />  <!-- Passing chatMessages to Chat component -->
            </div>
        </div>
    </slot>
</MainLayout>

<style>
    .live-stream-page {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 20px;
    }

    .live-stream-container {
        flex: 3;
        background-color: #000;
        border-radius: 10px;
        margin-left: 10px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .chat-container {
        flex: 1;
    }

    video {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }

    h1 {
        color: #fff;
        text-align: center;
        margin-bottom: 20px;
    }
</style>
