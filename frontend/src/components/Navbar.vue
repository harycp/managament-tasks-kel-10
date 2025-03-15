<template>
    <nav
  class="relative flex w-full flex-nowrap items-center justify-between bg-white py-2 shadow-md lg:flex-wrap lg:justify-start lg:py-4"
  data-twe-navbar-ref>
  <div class="flex w-full flex-wrap items-center justify-between px-3">
    <div class="mx-2">
        <img src="https://raw.githubusercontent.com/harycp/managament-tasks-kel-10/master/Screenshot%202025-03-13%20002716.png" alt="TunTask" class="h-10 w-auto">
    </div>
    <!-- Hamburger button for mobile view -->
    <button
      class="block border-0 bg-transparent px-2 text-black/50 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 lg:hidden"
      type="button"
      data-twe-collapse-init
      data-twe-target="#navbarSupportedContent11"
      aria-controls="navbarSupportedContent11"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <!-- Hamburger icon -->
      <span class="[&>svg]:w-7 [&>svg]:stroke-black/50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Collapsible navbar container -->
    <div
      class="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
      id="navbarSupportedContent11"
      data-twe-collapse-item>
      <!-- Left links -->
      <ul
        class="list-style-none me-auto flex flex-col ps-0 lg:mt-1 lg:flex-row"
        data-twe-navbar-nav-ref>
        <!-- Home link -->
        <li
          class="my-4 ps-2 lg:my-0 lg:pe-1 lg:ps-2"
          data-twe-nav-item-ref data-twe-dropdown-ref>
          <a
            class="text-black transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 active:text-black/80 motion-reduce:transition-none lg:px-2"
            aria-current="page"
            href="#"
            data-twe-nav-link-ref
            >Home</a
          >
        </li>
        <!-- Features link -->
        <li
          class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
          data-twe-nav-item-ref>
          <a
            class="p-0 text-black transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 active:text-black/80 motion-reduce:transition-none lg:px-2"
            href="#"
            data-twe-nav-link-ref
            >Features</a
          >
        </li>
        <!-- Pricing link -->
        <li
          class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
          data-twe-nav-item-ref>
          <a
            class="p-0 text-black transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 active:text-black/80 motion-reduce:transition-none lg:px-2"
            href="#"
            data-twe-nav-link-ref
            >Pricing</a
          >
        </li>
        <!-- About link -->
        <li
          class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
          data-twe-nav-item-ref>
          <a
            class="p-0 text-black transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 active:text-black/80 motion-reduce:transition-none lg:px-2"
            href="#"
            data-twe-nav-link-ref
            >About</a
          >
        </li>
      </ul>
      <ul
        class="list-style-none ms-auto flex flex-row items-center "
        data-twe-navbar-nav-ref>
        <li
          class="mb-4 ps-2 lg:mb-0 lg:pe-1 lg:ps-0"
          data-twe-nav-item-ref>
          <a
            class="p-0 text-black transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 active:text-black/80 motion-reduce:transition-none lg:px-2"
            href="#"
            data-twe-nav-link-ref
            >Log In</a
          >
        </li>
        <li>
            <!-- Sign Up Button -->
            <router-link to="#"
            class="relative z-[2] rounded-e border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 motion-reduce:transition-none text-primary-500 hover:bg-black hover:text-white"
            type="button"
            id="button-addon3"
            data-twe-ripple-init>
            Sign Up for Free!
            </router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
export default {

}
</script>

<style>

</style>