<template>
  <div class="listagem">
    <q-page padding>
      <div>
        <q-list v-if="tarefasFiltradas.length > 0" bordered class="rounded-list">
          <q-slide-item v-for="tarefa in tarefasFiltradas" :key="tarefa.id" right-color="positive"
            @right="onRight($event, tarefa)" left-color="negative"
            @left="onLeft($event, tarefa)">

            <template v-slot:right>
              <q-btn flat dense @click="toggleStatus(tarefa)"
                :icon="tarefa.status === 1 ? 'remove_done' : 'check_circle'"
                :label="tarefa.status === 1 ? 'Reaberta' : 'Concluida'" />
            </template>

            <template v-slot:left>
              <q-btn flat dense @click="confirmarExclusao(tarefa)"
                :icon="'check_circle'"
                :label="'Removida'" />
            </template>

            <q-item clickable class="rounded-item" :class="{ 'past-due': isDataPassada(tarefa.data_final) }">
              <q-item-section side>
                <q-btn flat round color="grey-7" icon="delete" @click="confirmarExclusao(tarefa)" />
              </q-item-section>

              <q-item-section side>
                <div class="row items-center no-wrap">
                  <q-icon name="lens" :color="getPriorityColor(tarefa.prioridade)" size="xs" class="q-mr-sm" />
                  <q-checkbox :model-value="tarefa.status === 1" @update:model-value="toggleStatus(tarefa)" />
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class=" text-dark text-subtitle1">
                  {{ tarefa.descricao.length > 10 ? tarefa.descricao.substring(0, 10) + '...' : tarefa.descricao }}
                  <q-tooltip v-if="tarefa.descricao.length > 16">
                    {{ tarefa.descricao }}
                  </q-tooltip>
                </q-item-label>

                <q-item-label v-if="tarefa.data_final" caption class="text-grey-8">
                  Data Final: {{ formatarData(tarefa.data_final) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round color="grey-7" icon="edit" @click="abrirDialogoEdicao(tarefa)" class="q-ml-sm" />
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>

        <div v-else-if="tarefas.length === 0" class="text-center text-grey q-mt-xl">
          Nenhuma tarefa encontrada. Adicione uma nova!
        </div>

        <div v-else class="text-center text-grey q-mt-xl">
          Nenhum resultado encontrado para os filtros aplicados.
        </div>
      </div>

      <div class="fab-container">
        <q-btn round color="primary" icon="filter_alt" size="lg" @click="showFilterDialog = true"
          aria-label="Abrir filtros" class="q-mb-md" />
        <q-btn round color="green" icon="add" size="lg" @click="abrirDialogoCriacao" />
      </div>

      <q-dialog v-model="showDialog">
        <q-card style="width: 400px; max-width: 90vw;">
          <q-card-section>
            <div class="text-h6">
              {{ modoEdicao ? 'Editar tarefa' : 'Adicionar tarefa' }}
            </div>
          </q-card-section>

          <q-form @submit.prevent="salvarTarefa">
            <q-card-section class="q-gutter-md">
              <q-input v-model="tarefaEmEdicao.descricao" label="Nome da tarefa" autofocus filled
                :rules="[val => !!val.trim() || 'A descrição é obrigatória']" />
              <q-input filled v-model="dataFinalFormatada" label="Data Final" mask="##/##/####"
                hint="Formato: DD/MM/AAAA">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="tarefaEmEdicao.data_final" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Fechar" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select v-model="tarefaEmEdicao.prioridade" :options="opcoesUrgencia" label="Urgência" filled emit-value
                map-options />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
              <q-btn flat label="Cancelar" color="grey" v-close-popup />
              <q-btn type="submit" :label="modoEdicao ? 'Salvar' : 'Adicionar'" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showFilterDialog">
        <q-card style="width: 400px; max-width: 90vw;">
          <q-card-section>
            <div class="text-h6">Filtrar Tarefas</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-select v-model="filtroPrioridade" :options="opcoesFiltroUrgencia" label="Urgência" filled emit-value
              map-options clearable @clear="filtroPrioridade = null" />
            <q-input filled v-model="filtroDataFormatada" label="Data Final" mask="##/##/####"
              hint="Tarefas do dia (DD/MM/AAAA)" clearable @clear="filtroData = null">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtroData" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select v-model="filtroStatus" :options="opcoesFiltroStatus" label="Status" filled emit-value
              map-options />
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Limpar Filtros" color="grey" @click="limparFiltros" v-close-popup />
            <q-btn label="Aplicar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';

  const $q = useQuasar();
  const opcoesUrgencia = [
    { label: 'Baixa', value: 1 },
    { label: 'Média', value: 2 },
    { label: 'Alta', value: 3 }
  ];
  const showFilterDialog = ref(false);
  const filtroPrioridade = ref(null);
  const filtroData = ref(null);
  const filtroStatus = ref(0);
  const opcoesFiltroUrgencia = ref([
    { label: 'Todas as Urgências', value: null },
    { label: 'Baixa', value: 1 },
    { label: 'Média', value: 2 },
    { label: 'Alta', value: 3 }
  ]);
  const opcoesFiltroStatus = ref([
    { label: 'Todas', value: 'todas' },
    { label: 'Pendentes', value: 0 },
    { label: 'Concluídas', value: 1 }
  ]);
  const filtroDataFormatada = computed({
    get() {
      if (!filtroData.value) {
        return '';
      }
      const [ano, mes, dia] = filtroData.value.split('-');
      if (!ano || !mes || !dia) return '';
      return `${dia}/${mes}/${ano}`;
    },
    set(novoValor) {
      if (!novoValor || novoValor.length < 10) {
        filtroData.value = null;
        return;
      }
      const [dia, mes, ano] = novoValor.split('/');
      if (!ano || !mes || !dia) {
        filtroData.value = null;
        return;
      }
      filtroData.value = `${ano}-${mes}-${dia}`;
    }
  });
  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 3: return 'red';
      case 2: return 'orange';
      case 1: return 'green';
      default: return 'grey-4';
    }
  };
  const isDataPassada = (dataString) => {
    if (!dataString) {
      return false;
    }
    try {
      const today = new Date();
      const startOfTodayUTC = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      ));
      const dueDate = new Date(dataString);
      if (isNaN(dueDate.getTime())) return false;
      const startOfDueDateUTC = new Date(Date.UTC(
        dueDate.getUTCFullYear(),
        dueDate.getUTCMonth(),
        dueDate.getUTCDate()
      ));
      return startOfDueDateUTC < startOfTodayUTC;
    } catch (e) {
      console.error("Erro ao processar data:", e);
      return false;
    }
  };
  const tarefas = ref([]);
  const showDialog = ref(false);
  const modoEdicao = ref(false);
  const tarefaEmEdicao = ref({});
  const dataFinalFormatada = computed({
    get() {
      if (!tarefaEmEdicao.value.data_final) {
        return '';
      }
      const dataApenas = tarefaEmEdicao.value.data_final.split('T')[0];
      const [ano, mes, dia] = dataApenas.split('-');
      if (!ano || !mes || !dia) return '';
      return `${dia}/${mes}/${ano}`;
    },
    set(novoValor) {
      if (!novoValor || novoValor.length < 10) {
        tarefaEmEdicao.value.data_final = null;
        return;
      }
      const [dia, mes, ano] = novoValor.split('/');
      if (!ano || !mes || !dia) {
        tarefaEmEdicao.value.data_final = null;
        return;
      }
      tarefaEmEdicao.value.data_final = `${ano}-${mes}-${dia}`;
    }
  });
  const formatarData = (dataString) => {
    if (!dataString) return '';
    const dataObj = new Date(dataString);
    if (isNaN(dataObj.getTime())) return 'Data inválida';
    const dia = String(dataObj.getUTCDate()).padStart(2, '0');
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
    const ano = dataObj.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  function onRight(slideItem, tarefa) {
    toggleStatus(tarefa);
    slideItem.reset(); 
  }

  function onLeft(slideItem, tarefa) {
    confirmarExclusao(tarefa)
    slideItem.reset(); 
  }

  function verificarTarefasPendentesHoje() {
    const today = new Date();
    const startOfTodayUTC = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ));
    const todayTimestamp = startOfTodayUTC.getTime();
    const tarefasPendentesHoje = tarefas.value.filter(tarefa => {
      const estaPendente = tarefa.status === 0;
      if (!estaPendente) return false;
      if (!tarefa.data_final) return false;
      try {
        const dueDate = new Date(tarefa.data_final);
        if (isNaN(dueDate.getTime())) return false;
        const startOfDueDateUTC = new Date(Date.UTC(
          dueDate.getUTCFullYear(),
          dueDate.getUTCMonth(),
          dueDate.getUTCDate()
        ));
        return startOfDueDateUTC.getTime() === todayTimestamp;
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        $q.notify({
          color: 'negative',
          message: 'Não foi possível carregar as tarefas.',
          icon: 'report_problem'
        });
      }
    });

    if (tarefasPendentesHoje.length > 0) {
      const plural = tarefasPendentesHoje.length > 1;
      $q.notify({
        message: `Você tem ${tarefasPendentesHoje.length} ${plural ? 'tarefas pendentes' : 'tarefa pendente'} para hoje!`,
        color: 'orange-8',
        position: 'top',
        timeout: 5000
      });
    }
  }

  const tarefasFiltradas = computed(() => {
    return tarefas.value.filter(tarefa => {
      const matchPrioridade = (
        filtroPrioridade.value === null ||
        tarefa.prioridade === filtroPrioridade.value
      );
      const matchStatus = (
        filtroStatus.value === 'todas' ||
        tarefa.status === filtroStatus.value
      );
      let matchData = true;
      if (filtroData.value) {
        const dataTarefa = tarefa.data_final ? tarefa.data_final.split('T')[0] : null;
        matchData = (dataTarefa === filtroData.value);
      }
      return matchPrioridade && matchStatus && matchData;
    });
  });

  function limparFiltros() {
    filtroPrioridade.value = null;
    filtroData.value = null;
    filtroStatus.value = 'todas';
  }

  async function buscarTarefas() {
    $q.loading.show({ message: 'Buscando tarefas...' });
    try {
      const response = await api.get('/tarefas');
      tarefas.value = response.data;
      setTimeout(() => {
        verificarTarefasPendentesHoje();
      }, 100);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      $q.notify({
        color: 'negative',
        message: 'Não foi possível carregar as tarefas.',
        icon: 'report_problem'
      });
    } finally {
      $q.loading.hide();
    }
  }

  async function salvarTarefa() {
    if (!tarefaEmEdicao.value.descricao?.trim()) return;
    const dados = {
      descricao: tarefaEmEdicao.value.descricao,
      status: tarefaEmEdicao.value.status || 0,
      data_final: tarefaEmEdicao.value.data_final || null,
      prioridade: tarefaEmEdicao.value.prioridade || 0
    };
    try {
      if (modoEdicao.value) {
        await api.put(`/tarefas/${tarefaEmEdicao.value.id}`, dados);
      } else {
        await api.post('/tarefas', dados);
      }
      $q.notify({ color: 'positive', message: 'Tarefa salva com sucesso!' });
      showDialog.value = false;
      await buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      $q.notify({
        color: 'negative',
        message: 'Erro ao salvar a tarefa. Verifique o console.',
        icon: 'report_problem'
      });
    }
  }

  function confirmarExclusao(tarefa) {
    $q.dialog({
      title: 'Confirmar Exclusão',
      message: `Deseja realmente deletar a tarefa "${tarefa.descricao}"?`,
      cancel: true,
      persistent: true,
      ok: { label: 'Deletar', color: 'negative' }
    }).onOk(async () => {
      try {
        await api.delete(`/tarefas/${tarefa.id}`);
        $q.notify({ color: 'positive', message: 'Tarefa deletada!' });
        await buscarTarefas();
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        $q.notify({ color: 'negative', message: 'Não foi possível deletar a tarefa.' });
      }
    });
  }

  async function toggleStatus(tarefa) {
    const dadosParaAtualizar = {
      descricao: tarefa.descricao,
      status: tarefa.status === 0 ? 1 : 0,
      prioridade: tarefa.prioridade,
      data_final: tarefa.data_final ? tarefa.data_final.split('T')[0] : null
    };
    try {
      await api.put(`/tarefas/${tarefa.id}`, dadosParaAtualizar);
      $q.notify({
        message: `Tarefa marcada como ${dadosParaAtualizar.status === 1 ? 'concluída' : 'pendente'}.`,
        color: 'info'
      });
      await buscarTarefas();
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
      $q.notify({
        color: 'negative',
        message: 'Não foi possível atualizar a tarefa.',
        icon: 'report_problem'
      });
    }
  }

  function abrirDialogoCriacao() {
    modoEdicao.value = false;
    tarefaEmEdicao.value = { descricao: '', status: 0, prioridade: 1, data_final: null };
    showDialog.value = true;
  }

  function abrirDialogoEdicao(tarefa) {
    modoEdicao.value = true;
    const tarefaParaEditar = { ...tarefa };
    if (tarefaParaEditar.data_final) {
      tarefaParaEditar.data_final = tarefaParaEditar.data_final.split('T')[0];
    }
    tarefaEmEdicao.value = tarefaParaEditar;
    showDialog.value = true;
  }
  onMounted(() => {
    buscarTarefas();
  });
</script>

<style scoped>
  .listagem {
    padding: 16px;
    position: relative;
  }

  .scroll-list {
    max-height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .fab-container {
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 150;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .rounded-list {
    border: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .rounded-item {
    height: 80px;
    border-radius: 20px;
    background: #fff !important;
    background-clip: padding-box;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s, border-color 0.2s;
    position: relative;
    z-index: 3;
  }

  .rounded-item.past-due {
    border: 2px solid #D32F2F;
    box-shadow: 0 2px 10px rgba(211, 47, 47, 0.2);
  }
</style>