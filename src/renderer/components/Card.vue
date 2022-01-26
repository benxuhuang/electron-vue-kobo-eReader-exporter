<template>
    <Col span="6" offset="2" style="margin-bottom:15px">
        <Card>
            <p slot="title">{{ book.Title }}</p>
            <p>39% Read</p>
            <p>5 Hours to go</p>
            <p></p>
        </Card>
    </Col>
</template>

<script>
export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
