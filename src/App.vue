<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import logo from '@/assets/logo.png'

const contador = ref(0)
const metaDiaria = ref(0)
const novaMeta = ref('')
const mostrandoModal = ref(false)

// Função para verificar e atualizar o contador e a meta no localStorage
const verificarContador = () => {
  const hoje = new Date().toDateString()
  const ultimoDia = localStorage.getItem('ultimoDia')
  const contadorSalvo = localStorage.getItem('contador')
  const metaSalva = localStorage.getItem('metaDiaria')

  if (ultimoDia !== hoje) {
    localStorage.setItem('ultimoDia', hoje)
    localStorage.setItem('contador', '0')
    contador.value = 0
  } else if (contadorSalvo) {
    contador.value = parseInt(contadorSalvo, 10)
  }

  if (metaSalva) {
    metaDiaria.value = parseInt(metaSalva, 10)
  }
}

// Função para incrementar o contador e salvar no localStorage
const fumarCigarro = () => {
  contador.value++
  localStorage.setItem('contador', contador.value.toString())

  if (metaDiaria.value > 0 && contador.value >= metaDiaria.value + 1) {
    Swal.fire({
      title: `Eita! Limite diario atingido! ${msgAviso.value}`,
      text: `Era pra parar em ${metaDiaria.value} cigarros, mas você já mandou ${contador.value} pra dentro. Quer que eu bata palma ou chame um médico?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Beleza, vou segurar a onda.',
      cancelButtonText: 'Cancelar Meta',
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        cancelarMeta()
      }
    })
  }
}

// Função para cancelar a meta diária
const cancelarMeta = () => {
  metaDiaria.value = 0
  localStorage.removeItem('metaDiaria')
}

// Função para limpar o contador e o localStorage
const limparContador = () => {
  contador.value = 0
  localStorage.setItem('contador', '0')
}

// Função para definir a meta diária
const definirMeta = () => {
  const meta = parseInt(novaMeta.value, 10)
  if (!isNaN(meta) && meta > 0) {
    metaDiaria.value = meta
    localStorage.setItem('metaDiaria', meta.toString())
    mostrandoModal.value = false
    novaMeta.value = ''
  }
}

// Computed properties para o emoji e mensagem
const emoji = computed(() => {
  if (contador.value >= metaDiaria.value) return '🫣'
  if (contador.value <= 5) return '😉'
  if (contador.value <= 10) return '😐'
  return '😔'
})

const getRandomMessage = (range: number) => {
  const messages: Record<number, string[]> = {
    0: ['Pense bem antes de fumar outro.', 'Vai com calma', 'Se é o bichão mesmo heim doido'],
    5: [
      'Tá tranquilo, tá favorável… Mas não se empolga, fumacento.',
      'Beleza, ainda dá pra fingir que você tem autocontrole.',
      'Você acha que tá suave, né? Amanhã a tosse vem te cobrar.',
    ],
    10: [
      'Já deu pra entender que você não tem amor aos seus pulmões.',
      'Parabéns, você tá oficialmente cagando pra sua saúde.',
      'Dá tempo de parar, mas se quiser continuar se matando, quem sou eu pra julgar?',
    ],
    15: [
      'Marlboro tá quase te mandando um prêmio de cliente VIP.',
      'Seus pulmões pediram demissão, já avisaram que não querem mais trabalhar.',
      'Se continuar assim, daqui a pouco o cigarro vai estar fumando você.',
    ],
    16: [
      'Parabéns! Você desbloqueou o modo "Chaminé Ambulante".',
      'Seus pulmões tão escrevendo uma carta de despedida nesse exato momento.',
      'Os caras da funerária tão de olho, já tão até te medindo.',
    ],
  }

  // Encontrar a faixa correspondente
  const keys = Object.keys(messages)
    .map(Number)
    .sort((a, b) => a - b)
  const faixa = keys.reverse().find((num) => range >= num) || 0

  // Retornar uma frase aleatória da faixa encontrada
  const frases = messages[faixa]
  return frases[Math.floor(Math.random() * frases.length)]
}

const msgAviso = computed(() => getRandomMessage(contador.value))

const metaAtingida = computed(() => {
  return metaDiaria.value > 0 && contador.value >= metaDiaria.value
})

onMounted(() => {
  verificarContador()
})
</script>

<template>
  <div class="min-h-screen bg-blue-200 flex flex-col items-center text-center text-blue-900">
    <div class="mt-6">
      <h1 class="text-sm font-bold">PUFF CONTROL</h1>
      <img src="@/assets/logo.png" alt="Puff Control" class="w-50 h-50 mx-auto mb-2" />
    </div>

    <h2 class="text-xl font-semibold mt-4">
      Vai fumar essa porcaria de novo?
      <span class="font-bold text-blue-900">Pelo menos conta direito!</span>
    </h2>

    <div class="bg-gray-100 w-full max-w-md mt-6 p-6 rounded-t-[4rem] shadow-lg">
      <div class="text-5xl mb-2">{{ emoji }}</div>
      <p class="text-lg font-medium">{{ msgAviso }}</p>

      <h3 class="text-6xl font-bold my-4">
        {{ contador }} <small v-if="metaDiaria">/ {{ metaDiaria }}</small>
      </h3>
      <p class="text-lg font-semibold">Cigarro(s)</p>

      <p v-if="metaAtingida" class="text-red-600 font-bold mt-2">Limite diario atingido</p>

      <button
        @click="fumarCigarro"
        class="bg-orange-500 text-white font-bold py-3 px-6 rounded-full text-lg mt-4 w-full"
      >
        FUMEI UM CIGARRO
      </button>

      <button
        @click="mostrandoModal = true"
        class="bg-red-500 text-white font-bold py-3 px-6 rounded-full text-lg mt-4 block w-full"
      >
        Criar uma meta diaria
      </button>
      <p>
        Que tal definir um limite diário e começar a reduzir? Ou vai seguir fumando sem freio até
        virar chaminé?
      </p>
      <button @click="limparContador" class="block text-lg font-bold mt-4 text-black w-full">
        LIMPAR CIGARROS
      </button>
    </div>

    <div
      v-if="mostrandoModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-bold mb-4">Definir Meta Diária</h3>
        <input
          v-model="novaMeta"
          type="number"
          placeholder="Digite a meta"
          class="border p-2 rounded w-full"
        />
        <div class="flex justify-between mt-4">
          <button @click="definirMeta" class="bg-green-500 text-white px-4 py-2 rounded">
            Salvar
          </button>
          <button @click="mostrandoModal = false" class="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Seu estilo permanece o mesmo */
</style>
