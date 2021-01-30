<template>
  <div
    v-bind:class="{'deleted': isDeleted}"
    class="comment">
      <p v-html="commentText"></p>
      <button @click="deleteComment" class="delete">Удалить комментарий</button>

      <CommentGroup v-if="showInnerComment" class="inner">
        <Comment
          v-for="(innerComment, index) in innerComments"
          ref="comments"
          :key="index"
          :comment-text="innerComment.commentText"
          :inner-comments="innerComment.innerComments">
        </Comment>
      </CommentGroup>
    </div>
</template>

<script>
import CommentGroup from '@/components/CommentGroup.vue';

export default {
  name: 'Comment',
  components: { CommentGroup },
  props: {
    commentText: {
      type: String,
      default: '',
    },
    innerComments: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      isDeleted: false,
    };
  },
  computed: {
    showInnerComment() {
      return this.innerComments && this.innerComments.length > 0;
    },
  },
  methods: {
    deleteComment() {
      this.isDeleted = true;
      if (this.$refs.comments) {
        Object.keys(this.$refs.comments).forEach((i) => {
          this.$refs.comments[i].deleteComment();
        });
      }
      console.log('delete comment with text:', this.commentText);
    },
  },
};
</script>

<style lang="scss" scoped>
  .comment {
    border: 1px solid #30363d;
    border-radius: 10px;
    margin-bottom: 10px;

    &.deleted {
      border-color: red;
    }
    .inner {
      padding: 10px;
    }
    p {
      padding: 10px;
    }
    button {
      border: 1px solid red;
      border-radius: 10px;
      background: #fff;
      cursor: pointer;
      margin: 10px;
      padding: 5px 10px;

      &.delete {
        color: red;
      }
    }
  }
</style>
