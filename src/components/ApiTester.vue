<template>
  <div class="api-tester">
    <div class="main-app">
      <div class="left">
        <!-- Group Selection -->
        <div class="section">
          <label for="group-select">Select Group:</label>
          <select v-model="selectedGroup" id="group-select" class="select" @change="fetchKeys">
            <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
          </select>
        </div>

        <!-- Create Group -->
        <div class="section">
          <h2>Create New Group</h2>
          <input v-model="newGroupName" placeholder="Group Name" class="input" />
          <select v-model.number="newGroupCapacity" id="capacity-select" class="select">
            <option :value="32">32MB</option>
            <option :value="128">128MB</option>
            <option :value="512">512MB</option>
            <option :value="1024">1024MB</option>
            <option :value="customCapacity">Custom</option>
          </select>
          <input v-if="newGroupCapacity === customCapacity" v-model.number="customCapacity" type="number" placeholder="Custom Capacity" class="input" />
          <button @click="createGroup" class="button">Create Group</button>
          <p v-if="createGroupMessage" class="message">{{ createGroupMessage }}</p>
        </div>

        <!-- Change Base URL -->
        <div class="section">
          <h2>Connection</h2>
          <input v-model="ipAddress" placeholder="IP Address" class="input" />
          <input v-model="port" placeholder="Port" class="input" />
          <button @click="changeBaseURL" class="button">Change Base URL</button>
          <p v-if="baseURLMessage" class="message">{{ baseURLMessage }}</p>
        </div>
      </div>

      <!-- Keys and Values Table -->
      <div class="right">
        <div class="section">
          <h2>Keys and Values</h2>
          <table v-if="keys.length > 0" class="kv-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in keyValues" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
                <td>
                  <button @click="deleteKeyValue(key)" class="delete-button">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else>No keys found for the selected group.</p>
          <div class="add-key-section">
            <input v-model="newKey" placeholder="New Key" class="input" />
            <input v-model="newValue" placeholder="New Value" class="input" />
            <button @click="addKey" class="button">Add Key</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import { setIPAddress, setPort, getBaseURL, getIPAddress, getPort } from '../config';

export default {
  data() {
    return {
      groups: [],
      selectedGroup: '',
      newGroupName: '',
      newGroupCapacity: 32, // Default capacity
      customCapacity: 0, // For custom input
      key: '',
      value: '',
      getKey: '',
      keyValue: '',
      deleteKey: '',
      createGroupMessage: '',
      setKeyMessage: '',
      deleteKeyMessage: '',
      keys: [],
      keyValues: {},
      newKey: '',
      newValue: '',
      ipAddress: getIPAddress(),  // New IP address state
      port: getPort(), // New port state
      baseURLMessage: '', // Message to display base URL change status
    };
  },
  created() {
    this.fetchGroups();
  },
  methods: {
    async fetchGroups() {
      try {
        const response = await axios.post('/huacache/list_group');
        console.log('API Response:', response.data);
        this.groups = response.data;
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },
    async createGroup() {
      try {
        const capacity = this.newGroupCapacity === this.customCapacity ? this.customCapacity : this.newGroupCapacity;
        await axios.post('/huacache/new_group', {
          name: this.newGroupName,
          capacity: capacity,
        }).then((res) => {
          this.createGroupMessage = res.data;

        });
        this.newGroupName = '';
        this.newGroupCapacity = 32; // Reset to default
        this.customCapacity = 0;
        await this.fetchGroups(); // Refresh group list
        setTimeout(() => {
          this.createGroupMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error creating group:', error);
        this.createGroupMessage = 'Error creating group.';
        setTimeout(() => {
          this.createGroupMessage = '';
        }, 3000);
      }
    },
    async setKey() {
      if (!this.selectedGroup) {
        alert('Please select a group');
        return;
      }
      try {
        await axios.post('/huacache/set', {
          key: this.key,
          value: this.value,
          group: this.selectedGroup,
        });
        this.key = '';
        this.value = '';
        this.setKeyMessage = 'Key set successfully!';
        setTimeout(() => {
          this.setKeyMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error setting key:', error);
        this.setKeyMessage = 'Error setting key.';
        setTimeout(() => {
          this.setKeyMessage = '';
        }, 3000);
      }
    },
    async getKeyValue() {
      if (!this.selectedGroup) {
        alert('Please select a group');
        return;
      }
      try {
        const response = await axios.post('/huacache/get', {
          key: this.getKey,
          group: this.selectedGroup,
        });
        this.keyValue = response.data || 'No value found';
      } catch (error) {
        console.error('Error getting key:', error);
      }
    },
    async deleteKeyValue(key) {
      if (!this.selectedGroup) {
        alert('Please select a group');
        return;
      }
      try {
        await axios.post('/huacache/del', {
          key: key,
          group: this.selectedGroup,
        });
        delete this.keyValues[key];
        this.deleteKeyMessage = 'Key deleted successfully!';
        setTimeout(() => {
          this.deleteKeyMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting key:', error);
        this.deleteKeyMessage = 'Error deleting key.';
        setTimeout(() => {
          this.deleteKeyMessage = '';
        }, 3000);
      }
    },
    async fetchKeys() {
      if (!this.selectedGroup) {
        return;
      }
      try {
        const response = await axios.post('/huacache/keys', {
          group: this.selectedGroup,
        });
        this.keys = response.data;
        this.keyValues = {};
        for (const key of this.keys) {
          const valueResponse = await axios.post('/huacache/get', {
            key: key,
            group: this.selectedGroup,
          });
          this.keyValues[key] = valueResponse.data || 'No value found';
        }
      } catch (error) {
        console.error('Error fetching keys:', error);
      }
    },
    async addKey() {
      if (!this.selectedGroup) {
        alert('Please select a group');
        return;
      }
      try {
        await axios.post('/huacache/set', {
          key: this.newKey,
          value: this.newValue,
          group: this.selectedGroup,
        }).then(() => {
          this.fetchKeys();
        });
        this.keyValues[this.newKey] = this.newValue;
        this.newKey = '';
        this.newValue = '';
        this.setKeyMessage = 'Key added successfully!';
        setTimeout(() => {
          this.setKeyMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error adding key:', error);
        this.setKeyMessage = 'Error adding key.';
        setTimeout(() => {
          this.setKeyMessage = '';
        }, 3000);
      }
    },
    changeBaseURL() {
      if (this.ipAddress.trim() === '' || this.port.trim() === '') {
        alert('Please enter both IP address and port');
        return;
      }

      setIPAddress(this.ipAddress);
      setPort(this.port);

      // Update the axios instance baseURL
      axios.defaults.baseURL = getBaseURL();
      
      this.baseURLMessage = `Base URL changed to ${getBaseURL()}`;
      setTimeout(() => {
        this.baseURLMessage = '';
      }, 3000);
    },
  },
};
</script>
<style scoped>
.api-tester {
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #333;
}

.input, .select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input:focus, .select:focus {
  border-color: #007BFF;
  outline: none;
}

.button {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 10px;
  padding: 10px;
  background: #28a745;
  color: white;
  border-radius: 4px;
  text-align: center;
}

.kv-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.kv-table th, .kv-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.kv-table th {
  background-color: #007BFF;
  color: white;
}

.kv-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.kv-table tr:hover {
  background-color: #ddd;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}

.add-key-section {
  margin-top: 20px;
}

.main-app {
  display: flex;
}

.left {
  flex: 1;
  margin-right: 12%;
  /* 你可以添加其他样式，比如 padding 或 margin */
}

.right {
  flex: 1;
  margin-right: 10%;
  /* 你可以添加其他样式，比如 padding 或 margin */
}
</style>
