import axios from 'axios';
import {User} from "../types/User";
import {loginDetails} from "../types/loginDetails";
import type {PasswordFields} from "../types/PasswordFields";
const API_URL = 'http://localhost:8080/FoodDonation';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export class foodDonationService {

  static async registerUser(userData: User) {
    return await axios.post(`${API_URL}/registration`, userData);
  }

  static async loginUser(userData: loginDetails) {
    return await axios.post(`${API_URL}/login`, userData);
  }

  // Donations
  static async postDonation(donationData: object) {
    return await axios.post(`${API_URL}/postdonation`, donationData, authHeader());
  }

  static async getMyDonations() {
    return await axios.get(`${API_URL}/mydonations`, authHeader());
  }

  static async getActiveDonations() {
    return await axios.get(`${API_URL}/activedonations`, authHeader());
  }

  static async gethourlyTrends() {
    return await axios.get(`${API_URL}/analytics`, authHeader());
  }

  // Profile
  static async getProfileDonor() {
    return await axios.get(`${API_URL}/profiledonor`, authHeader());
  }

  static async updateProfile(profileData: object) {
    return await axios.put(`${API_URL}/profile`, profileData, authHeader());
  }
  static async updatePassword(passwordData: PasswordFields) {
    return await axios.post(`${API_URL}/updatepassword`, {
      currentPassword: passwordData.current,
      newPassword: passwordData.new,
    }, authHeader());
  }
  static async submitVerification(formData: FormData) {
    return axios.post(`${API_URL}/verification`, formData, authHeader());
  }
  static async submitVolunteerVerification(govId: File, selfie: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify({ documentLabel: 'Government ID' })], { type: 'application/json' }));
    formData.append('govId', govId);
    formData.append('selfie', selfie);
    return axios.post(`${API_URL}/verification`, formData, authHeader());
  }
   static async getMyVerification() {
    return await axios.get(`${API_URL}/verification/me`, authHeader());
  }
  static async getPendingRecords()
  {
      return await axios.get(`${API_URL}/adminDashboard`, authHeader());
  }
  static async submitAdminStatus(adminData:object)
  {
      return await axios.post(`${API_URL}/adminDashboard/submitAdminStatus`,adminData,authHeader());
  }
  static async getProfileRecipient(){
    return await axios.get(`${API_URL}/profilerecipient`, authHeader());
  }
  static async getRecipientDashboard(){
    return await axios.get(`${API_URL}/recipientDashboard`, authHeader());
  }

  // Donor request management
  static async getDonorIncomingRequests() {
    return await axios.get(`${API_URL}/donor/requests`, authHeader());
  }
  static async approveDonorRequest(requestId: number) {
    return await axios.patch(`${API_URL}/donor/requests/${requestId}/approve`, {}, authHeader());
  }
  static async rejectDonorRequest(requestId: number) {
    return await axios.patch(`${API_URL}/donor/requests/${requestId}/reject`, {}, authHeader());
  }

  // Recipient request donation
  static async requestDonation(donationId: number) {
    return await axios.post(`${API_URL}/requestdonation`, { donationId }, authHeader());
  }

  // Volunteer
  static async getVolunteerDashboard() {
    return await axios.get(`${API_URL}/volunteer/dashboard`, authHeader());
  }
  static async getAvailablePickups() {
    return await axios.get(`${API_URL}/volunteer/available-pickups`, authHeader());
  }
  static async claimPickup(requestId: number) {
    return await axios.post(`${API_URL}/volunteer/claim/${requestId}`, {}, authHeader());
  }
  static async updateDeliveryStatus(deliveryId: number, status: string) {
    return await axios.patch(`${API_URL}/volunteer/delivery/${deliveryId}/status`, { status }, authHeader());
  }
  static async getActiveDelivery() {
    return await axios.get(`${API_URL}/volunteer/my-delivery`, authHeader());
  }
  static async getVolunteerProfile() {
    return await axios.get(`${API_URL}/volunteer/profile`, authHeader());
  }
  static async getVolunteerAnalytics() {
    return await axios.get(`${API_URL}/volunteer/analytics`, authHeader());
  }

}