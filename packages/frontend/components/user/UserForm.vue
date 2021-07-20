<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-row align="center">
        <v-col cols="auto">
          <v-fade-transition leave-absolute tag="span">
            <v-skeleton-loader v-if="!user" type="avatar" width="48" />
            <avatar v-else :size="48" :color="user.color" :sex="user.sex" />
          </v-fade-transition>
        </v-col>
        <v-col cols="auto">
          <template v-if="create"> <h1>New user</h1> </template>
          <template v-else>
            <v-fade-transition leave-absolute>
              <v-skeleton-loader v-if="!user" key="1" type="text" />
              <h1 v-else key="3">{{ user.firstname }} {{ user.surname }}</h1>
            </v-fade-transition>
          </template>
          <color-picker v-model="formUser.color" :readonly="readonly">
            <template #activator="{ on, attrs }">
              <v-btn x-small text class="mt-1 ml-n2" v-bind="attrs" v-on="on">
                <v-row dense align="center">
                  <v-col cols="auto">
                    <div
                      :style="{
                        backgroundColor: formUser.color,
                        width: 16 + 'px',
                        height: 16 + 'px',
                        borderRadius: 4 + 'px',
                      }"
                    ></div>
                  </v-col>
                  <v-col> Pick color </v-col>
                </v-row>
              </v-btn>
            </template>
          </color-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form :readonly="readonly">
            <v-text-field
              v-if="create"
              v-model="formUser.username"
              label="Username"
              prepend-icon="mdi-text"
              :error-messages="$v.username.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-text-field
              v-model="formUser.firstname"
              label="First name"
              prepend-icon="mdi-text"
              :error-messages="$v.firstname.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-text-field
              v-model="formUser.surname"
              label="Surname"
              prepend-icon="mdi-text"
              :error-messages="$v.surname.$errors.map((e) => e.$message)"
              @keydown.enter="submit"
            />
            <v-select
              v-model="formUser.sex"
              :items="sexSelect"
              prepend-icon="mdi-gender-male-female"
              label="Sex"
              single-line
            ></v-select>
            <v-text-field
              v-if="!readonly"
              v-model="formUser.password"
              label="Password"
              type="password"
              prepend-icon="mdi-lock"
              :error-messages="$v.password.$errors.map((e) => e.$message)"
              autocomplete="new-password"
              @keydown.enter="submit"
            />
            <v-text-field
              v-if="!readonly"
              v-model="formUser.passRepeat"
              label="Repeat password"
              type="password"
              prepend-icon="mdi-lock"
              :error-messages="$v.passRepeat.$errors.map((e) => e.$message)"
              autocomplete="new-password"
              @keydown.enter="submit"
            />
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="readonly" color="primary" @click="submit">
        <template v-if="create"> Create </template>
        <template v-else> Save </template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, requiredIf, sameAs } from '@vuelidate/validators'
import {
  defineComponent,
  reactive,
  toRef,
  watch,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import ColorPicker from '../ColorPicker.vue'
import Avatar from '../Avatar.vue'
import { FormUser, SexValues } from '~/store/models/user.model'
export default defineComponent({
  components: { ColorPicker, Avatar },
  props: {
    value: {
      required: false,
      default: undefined,
      type: Object,
    },
    readonly: {
      required: false,
      default: false,
      type: Boolean,
    },
    loading: {
      required: false,
      default: false,
      type: Boolean,
    },
    create: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  setup(props: any, { emit }) {
    const user = toRef(props, 'value')
    const formUser = reactive<FormUser>(Object.assign(new FormUser()))
    watch(user, () => Object.assign(formUser, user.value))

    const $v = useVuelidate(
      {
        username: { requiredif: requiredIf(props.create) },
        firstname: { required },
        surname: { required },
        password: {},
        passRepeat: {
          sameAs: sameAs(toRef(formUser, 'password'), 'Password'),
        },
      },
      formUser
    )
    return {
      $v,
      user,
      formUser,
      sexSelect: SexValues,
      submit() {
        $v.value.$touch()
        const submitUser = _.cloneDeep(formUser)
        if (!$v.value.$invalid && (submitUser.id || props.create)) {
          if (submitUser.password === '') delete submitUser.password
          delete submitUser.passRepeat

          formUser.password = ''
          formUser.passRepeat = ''

          emit('submit', submitUser)
          $v.value.$reset()
        }
      },
    }
  },
})
</script>

<style scoped></style>
