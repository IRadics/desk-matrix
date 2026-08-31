<script lang="ts" setup>
useSeoMeta({
  title: 'Desk-Mounted MultiBoard Framework',
  ogTitle: 'DeskMatrix - Desk-Mounted Framework for MultiBoard',
  description:
    'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
  ogDescription:
    'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
  ogImage: '/thumbnail.png',
})

const supportModalOpen = ref<boolean>(false)
const licenseModalOpen = ref<boolean>(false)

const imageDialog = useImageDialog()

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  })
}
</script>

<template>
  <main class="bg-default">
    <div class="flex flex-col w-full min-h-dvh justify-center items-center">
      <UPageHero
        :ui="{
          container: 'py-10 sm:py-14! lg:py-18!',
          root: 'w-full bg-[var(--ui-color-neutral-800)] h-fit',
        }"
        title="Desk Mounted Framework for MultiBoard"
      >
        <template #description>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-1">
              <span
                >A multi piece desk mounted solution for MultiBoard, which
                provides a stable structure, minimized flexing and full
                modularity</span
              >
              <span>A comprehensive alternative system to wall mounting.</span>
              <span class="mt-4"
                >Create your plan here then 3D print from MakerWorld</span
              >
            </div>
            <div
              class="flex gap-4 justify-center items-center flex-col md:flex-row"
            >
              <UButton
                label="DeskMatrix Planner"
                to="/planner"
                color="primary"
                icon="i-lucide-grid-3x3"
                class="py-4 px-6 text-base md:text-xl font-bold justify-center"
                size="xl"
              />
              <UButton
                label="Download from MakerWorld"
                to="https://makerworld.com/en/models/3214047-deskmatrix-desk-mount-framework-for-multiboard#profileId-3638506"
                target="_blank"
                icon="i-custom-maker-world"
                class="[&_svg]:text-white! py-4 px-6 text-base md:text-xl font-bold justify-center"
                size="xl"
                variant="outline"
              />
            </div>
          </div>
        </template>
        <template #headline>
          <div class="flex w-full justify-center">
            <UIcon name="i-custom-logo" :size="140" />
          </div>
        </template>
        <template #bottom>
          <div class="flex justify-center">
            <UButton
              label="Support me"
              icon="i-lucide-heart-plus"
              size="xl"
              class="px-6 justify-center"
              variant="ghost"
              @click="supportModalOpen = true"
            />
            <UButton
              label="License"
              icon="i-lucide-creative-commons"
              size="xl"
              class="px-6 justify-center"
              variant="ghost"
              @click="licenseModalOpen = true"
            />
          </div>
          <div
            class="flex justify-center w-full italic text-white/50 my-2 px-4"
          >
            <span
              >DeskMatrix is an independent, unofficial community project. It is
              not affiliated with, sponsored by, or endorsed by MultiBuild,
              Multiboard LTD, or Keep Making.</span
            >
          </div>
        </template>
      </UPageHero>
      <UButton
        variant="subtle"
        size="lg"
        class="mt-5 mb-5 lg:mb-0"
        icon="i-lucide-arrow-down"
        @click="scrollTo('section-1')"
      />
    </div>

    <UPageSection
      id="section-1"
      headline="A wall-free MultiBoard foundation"
      title="Build a stable, modular setup directly from your desk"
      description="DeskMatrix is a multi-piece, 3D-printable framework that clamps to a desktop and supports MultiBoard tiles without drilling into a wall. It is designed to reduce flex while keeping the layout modular, making it useful for rented spaces, adjustable desks, workbenches, and other places where permanent wall mounting is not practical."
      orientation="vertical"
      class="flex flex-col justify-center items-center border-t border-default relative"
      :ui="{
        container: 'pb-8 sm:pb-12 lg:pb-16',
      }"
    >
      <UPageGrid>
        <UPageCard
          title="Desk-mounted"
          description="Clamps secure the framework to the tabletop. Available in various sizes to fit different desk thicknesses. Top and bottom protector plates are strongly recommended."
          icon="i-lucide-panel-top"
          variant="subtle"
        >
          <div class="bg-neutral-200 rounded-lg mt-auto">
            <ImageEnlargable
              class="w-full"
              src="/img/table.webp"
              :width="400"
            />
          </div>
        </UPageCard>
        <UPageCard
          title="Modular by design"
          description="Combine beams, two-way, three-way, and four-way corners, clamps, and MultiBoard tiles to create a framework sized for your available desk space."
          icon="i-lucide-blocks"
          variant="subtle"
        >
          <div class="rounded-lg mt-auto overflow-hidden">
            <ImageEnlargable
              class="w-full"
              :width="400"
              src="/img/animation.webp"
              animated
            />
          </div>
        </UPageCard>
        <UPageCard
          title="A practical alternative"
          description="DeskMatrix offers a flexible option when wall mounting is unavailable. It can carry a useful load, but it is not intended to match the strength of a correctly installed wall-mounted board."
          icon="i-lucide-scale"
          variant="subtle"
        >
          <div class="rounded-lg mt-auto overflow-hidden">
            <ImageEnlargable
              class="w-full"
              src="/img/photo.webp"
              :width="400"
            />
          </div>
        </UPageCard>
        <UButton
          variant="subtle"
          size="lg"
          class="w-fit sticky bottom-5 mx-auto col-span-full"
          icon="i-lucide-arrow-down"
          @click="scrollTo('section-2')"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="section-2"
      headline="System components"
      title="Choose the parts that fit your layout"
      description="The system uses compatible beam ends and corner pieces so the supporting frame can grow horizontally and vertically with your MultiBoard arrangement."
      orientation="vertical"
      class="bg-elevated/40 border-y border-default"
      :ui="{
        container: 'pb-8 sm:pb-12 lg:pb-16',
      }"
    >
      <div class="grid gap-6 md:grid-cols-3 text-left">
        <section class="rounded-lg border border-default bg-default p-6">
          <h3 class="text-xl font-semibold text-highlighted">Clamps</h3>
          <ImageEnlargable src="/img/clamp.webp" :width="400" />
          <p class="mt-3 text-toned">
            Select a clamp gap that matches your tabletop. Desk protector plates
            spread the clamping force, while an optional TPU pad can add grip
            beneath the desk.
          </p>
        </section>
        <section class="rounded-lg border border-default bg-default p-6">
          <h3 class="text-xl font-semibold text-highlighted">Beams</h3>
          <ImageEnlargable src="/img/beams.webp" :width="400" />
          <p class="mt-3 text-toned">
            Regular and quad beam variants are available with male and female
            connector combinations. Their snap-based lengths make it easier to
            match a planned MultiBoard grid.
          </p>
        </section>
        <section class="rounded-lg border border-default bg-default p-6">
          <h3 class="text-xl font-semibold text-highlighted">Corners</h3>
          <ImageEnlargable src="/img/corner.webp" :width="400" />
          <p class="mt-3 text-toned">
            Two-way, three-way, and four-way corners connect the frame at its
            edges and intersections, with optional central snap variants for
            attaching MultiBoard tiles.
          </p>
        </section>
      </div>
      <UButton
        variant="subtle"
        size="lg"
        class="w-fit sticky bottom-5 mx-auto col-span-full"
        icon="i-lucide-arrow-down"
        @click="scrollTo('section-3')"
      />
    </UPageSection>

    <UPageSection
      id="section-3"
      headline="From layout to print bed"
      title="Plan first, then print only what you need"
      description="Use the planner to assemble a virtual frame and produce a bill of materials for your configuration."
      orientation="vertical"
    >
      <ol class="grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
        <li class="rounded-lg border border-default p-6">
          <span class="text-sm font-semibold text-primary">01</span>
          <h3 class="mt-2 text-lg font-semibold text-highlighted">
            Set out the boards
          </h3>
          <p class="mt-2 text-toned">
            Add MultiBoard tiles in the arrangement you want above or around
            your desk.
          </p>
        </li>
        <li class="rounded-lg border border-default p-6">
          <span class="text-sm font-semibold text-primary">02</span>
          <h3 class="mt-2 text-lg font-semibold text-highlighted">
            Build the frame
          </h3>
          <p class="mt-2 text-toned">
            Place clamps, beams, and corners around the boards and connect them
            into a stable supporting structure.
          </p>
        </li>
        <li class="rounded-lg border border-default p-6">
          <span class="text-sm font-semibold text-primary">03</span>
          <h3 class="mt-2 text-lg font-semibold text-highlighted">
            Export the parts list
          </h3>
          <p class="mt-2 text-toned">
            Review the calculated DeskMatrix parts, MultiBoard pieces, bolts,
            and additional hardware, then download the list.
          </p>
        </li>
        <li class="rounded-lg border border-default p-6">
          <span class="text-sm font-semibold text-primary">04</span>
          <h3 class="mt-2 text-lg font-semibold text-highlighted">
            Test and print
          </h3>
          <p class="mt-2 text-toned">
            Print the connector fit test before committing to the full build,
            then download the required model plates from MakerWorld.
          </p>
        </li>
      </ol>

      <template #footer>
        <div
          class="mx-auto max-w-3xl rounded-lg border border-warning/40 bg-warning/10 p-5 text-left"
        >
          <h3 class="font-semibold text-highlighted">Before you print</h3>
          <p class="mt-2 text-sm text-toned">
            Assembly bolts are separate MultiBoard parts and are not included
            with the DeskMatrix model files. Follow the official MultiBoard
            print recommendations and the DeskMatrix print profiles for strong,
            dimensionally accurate parts. Longer beams can exceed the build area
            of compact printers such as the A1 Mini, so verify model size before
            printing.
          </p>
        </div>
        <div
          class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <UButton
            label="Open the DeskMatrix Planner"
            to="/planner"
            icon="i-lucide-grid-3x3"
            size="xl"
          />
          <UButton
            label="Get the model on MakerWorld"
            to="https://makerworld.com/en/models/3214047-deskmatrix-desk-mount-framework-for-multiboard"
            target="_blank"
            icon="i-custom-maker-world"
            color="neutral"
            variant="outline"
            size="xl"
          />
        </div>
      </template>
    </UPageSection>

    <SupportDialog v-model:open="supportModalOpen" />
    <LicenseDialog v-model:open="licenseModalOpen" />
  </main>
</template>
