<script lang="ts">
interface CreativeData {
    id: string;
    name: string;
    bio: string;
    portfolio: string;
    category: string;
    creative_card: Array<{
        type: string;
        name: string;
        external?: { url: string };
        file?: { url: string };

    }>
}
</script>

<div >

</div>