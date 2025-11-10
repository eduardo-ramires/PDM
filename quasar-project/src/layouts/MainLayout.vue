<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-7 text-white">
      <q-toolbar style="padding-top: env(safe-area-inset-top)">
        <q-toolbar-title class="row items-center no-wrap q-gutter-sm">
          <span class="text-weight-light">Minhas Tarefas</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
