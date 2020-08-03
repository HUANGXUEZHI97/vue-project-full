<template>
  <div>
    <div class="hover-circle">CSS</div>
    <div class="tc">
      <div class="title1">
        <span>距离结束还有10天</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
// @keyframes circle {
//   0% {
//     opacity: 0;
//     scale: 1;
//   }

//   25% {
//     opacity: 0.25;
//   }

//   50% {
//     opacity: 0.5;
//     scale: 1.03;
//   }

//   75% {
//     opacity: 0.75;
//   }

//   100% {
//     opacity: 1;
//     scale: 1.03;
//   }
// }
// .hover-circle {
//   width: 100%;
//   height: 100%;
//   color: #666;
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-size: 3rem;
//   letter-spacing: 0.3rem;
//   font-weight: bold;
//   cursor: pointer;
//   >::before {
//     content: "";
//     width: 8.5rem;
//     height: 8.5rem;
//     border: 6px solid pink;
//     border-radius: 50%;
//     position: absolute;
//     opacity: 0;
//   }
//   >::after {
//     content: "";
//     widows: 7.2rem;
//     height: 7.2rem;
//     border: 6px solid pink;
//     border-radius: 50%;
//     position: absolute;
//     opacity: 0;
//   }
//   >:hover {
//     >::before & >::after {
//       animation-duration: 0.8s;
//       animation-delay: 0.2s;
//       animation: circle 0.8s;
//     }
//   }
// }
.hover-circle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 3rem;
  letter-spacing: 0.3rem;
  font-weight: bold;
  position: relative;
  cursor: pointer;
  color: #666;
}

.hover-circle::before {
  width: 8.5rem;
  height: 8.5rem;
  border: 3px solid pink;
  content: "";
  border-radius: 50%;
  position: absolute;
  opacity: 0;
}

.hover-circle::after {
  width: 7.2rem;
  height: 7.2rem;
  border: 6px solid pink;
  content: "";
  border-radius: 50%;
  position: absolute;
  opacity: 0;
}

.hover-circle:hover::before,
.hover-circle:hover::after {
  animation-duration: 0.8s;
  animation-delay: 0.2s;
  animation: circle 0.8s;
}

@keyframes circle {
  0% {
    opacity: 0;
    scale: 1;
  }

  25% {
    opacity: 0.25;
  }

  50% {
    opacity: 0.5;
    scale: 1.03;
  }

  75% {
    opacity: 0.75;
  }

  100% {
    opacity: 1;
    scale: 1.03;
  }
}
.title1 {
  position: relative;
  display: inline-block;
}

.title1 span {
  position: relative;
  z-index: 2;
  display: inline-block;
  padding: 0 15px;
  height: 32px;
  line-height: 32px;
  background-color: #dc5947;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 10px 6px -9px rgba(0, 0, 0, 0.6);
}

.title1 span::before,
.title1 span::after {
  position: absolute;
  bottom: -6px;
  border-width: 3px 5px;
  border-style: solid;
  content: "";
}

.title1 span::before {
  left: 0;
  border-color: #972f22 #972f22 transparent transparent;
}

.title1 span::after {
  right: 0;
  border-color: #972f22 transparent transparent #972f22;
}

.title1::before,
.title1::after {
  position: absolute;
  top: 6px;
  content: "";
  border-style: solid;
  border-color: #dc5947;
}

.title1::before {
  left: -32px;
  border-width: 16px 26px 16px 16px;
  border-left-color: transparent;
}

.title1::after {
  right: -32px;
  border-width: 16px 16px 16px 26px;
  border-right-color: transparent;
}
</style>